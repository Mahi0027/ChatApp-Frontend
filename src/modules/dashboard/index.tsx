import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import MenuSection from "./MenuSection";
import ConversationsList from "./ConversationsList";
import { io } from "socket.io-client";
import { dashboardContext, primaryContext } from "@/src/context";
import Loader from "@/public/assets/loader.gif";

/* define type of status start. */
type CurrentConversationUserType = {
    conversationId: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
};

type NewUserDetailsType = {
    userId: string;
    user: {
        email: string;
        firstName: string;
        lastName: string;
    };
};

type ConversationsListType = {
    conversationId: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImage: string;
    };
}[];
/* define type of status end. */

const Dashboard = () => {
    /* context declaration start. */
    const { activeUsers, setActiveUsers } = useContext(primaryContext);
    const { dashboardType, setDashboardType, adminUser, setAdminUser, theme } =
        useContext(
            dashboardContext
        ); /* it's for show/hide user/message icon. */
    /* context declaration end. */

    /* state variable declaration start. */
    const [socket, setSocket] = useState<any | null>(null);
    const [homePageForUserListFlag, setHomePageForUserListFlag] =
        useState<boolean>(true); /* home page for user list content side */
    const [
        homePageForConversationListFlag,
        setHomePageForConversationListFlag,
    ] =
        useState<boolean>(
            true
        ); /* home page for conversation list content side */
    const [menuSectionShowFlag, setMenuSectionShowFlag] =
        useState<boolean>(true); /* flag to show/hide menu section. */
    const [conversationSectionShowFlag, setConversationSectionShowFlag] =
        useState<boolean>(false); /* flag to show/hide conversation section. */
    const [messages, setMessages] = useState<any>(
        []
    ); /* store current selected user's all message. */
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<any>({});
    const [currentConversationUser, setCurrentConversationUser] =
        useState<CurrentConversationUserType>({
            conversationId: "",
            user: { id: "", email: "", firstName: "", lastName: "" },
        }); /* store current user details with whom admin user is talking. */
    const [newUserDetails, setNewUserDetails] = useState<NewUserDetailsType>({
        userId: "",
        user: {
            email: "",
            firstName: "",
            lastName: "",
        },
    });
    const [conversationsList, setConversationsList] =
        useState<ConversationsListType>([
            {
                conversationId: "",
                user: {
                    id: "",
                    email: "",
                    firstName: "",
                    lastName: "",
                    profileImage: "",
                },
            },
        ]);
    /* state variable declaration end. */

    /* ref hook variable declaration start. */
    const conversationsListRef =
        useRef<ConversationsListType>(conversationsList);
    const currentConversationUserRef = useRef<CurrentConversationUserType>(
        currentConversationUser
    ); /* store current user details with whom admin user is talking in ref for using in socket. */
    /* ref hook variable declaration end. */

    /* useEffect functions start. */
    useEffect(() => {
        const fetchData = async () => {
            const localStorageAdminDetail = await JSON.parse(
                localStorage.getItem("user:detail") || "null"
            );
            if (
                localStorageAdminDetail !== null &&
                localStorageAdminDetail.id
            ) {
                try {
                    const adminUserDetails = await getAdminUserDetail(
                        localStorageAdminDetail.id
                    );
                    if (setAdminUser) {
                        setAdminUser({
                            id: adminUserDetails._id,
                            email: adminUserDetails.email,
                            firstName: adminUserDetails.firstName,
                            lastName: adminUserDetails.lastName,
                            nickName: adminUserDetails.nickName,
                            profileImage: adminUserDetails.profileImage,
                            status: adminUserDetails.status,
                            theme: adminUserDetails.theme,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching admin user details:", error);
                }
            }
        };
        fetchData();

        if (window.innerWidth < 640) {
            setConversationSectionShowFlag(false);
        } else {
            setConversationSectionShowFlag(true);
        }

        // Add a resize event listener
        window.addEventListener("resize", handleResizeScreenSize);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener("resize", handleResizeScreenSize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* show list of all conversations. */
    const showListOfAllConversations = useCallback(async () => {
        var loggedUserId = adminUser.id;
        if (loggedUserId === "") {
            const loggedInUser = JSON.parse(
                localStorage.getItem("user:detail") || "null"
            );
            loggedUserId = (loggedInUser?.id as string) || "";
        }
        const res = await fetch(
            `http://localhost:8000/api/conversations/${loggedUserId} `,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await res.json();
        setConversationsList(result);
        setDashboardType((prevState: any) => ({
            ...prevState,
            chat: true,
            user: false,
        }));
    }, [adminUser.id, setDashboardType]);

    useEffect(() => {
        /* create socket user */
        if (adminUser.id && adminUser.id !== "") {
            setSocket(io("http://localhost:8080"));
            showListOfAllConversations();
        }
    }, [adminUser.id, showListOfAllConversations]);

    useEffect(() => {
        currentConversationUserRef.current = currentConversationUser;
    }, [currentConversationUser]);

    useEffect(() => {
        conversationsListRef.current = conversationsList;
    }, [conversationsList]);

    useEffect(() => {
        if (adminUser.id) {
            socket?.emit("addUser", adminUser.id);
            socket?.on("getUsers", (activeUsers: any) => {
                setActiveUsers(activeUsers);
            });
            socket?.on(
                "getMessage",
                async ({
                    conversationId,
                    senderId,
                    message,
                    type,
                    timeStamp,
                    receiver,
                }: {
                    conversationId: String;
                    senderId: String;
                    message: String;
                    type: String;
                    timeStamp: String;
                    receiver: any;
                }) => {
                    setMessages((prevData: any) => [
                        ...prevData,
                        {
                            user: {
                                id: currentConversationUserRef.current.user.id,
                                email: currentConversationUserRef.current.user
                                    .email,
                                firstName:
                                    currentConversationUserRef.current.user
                                        .firstName,
                                lastName:
                                    currentConversationUserRef.current.user
                                        .lastName,
                            },
                            message: message,
                            timeStamp: timeStamp,
                            type: type,
                        },
                    ]);

                    /* if sender and receiver and page is open of sender so make message as read. */
                    if (
                        receiver.userId === adminUser.id &&
                        senderId === currentConversationUserRef.current.user.id
                    ) {
                        const res = await fetch(
                            `http://localhost:8000/api/messageReadUpdate/${conversationId}/${senderId}`,
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        if (res.status === 200) {
                            const result = await res.json();
                        }
                    }
                    countUnreadMessages();
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        countUnreadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminUser, conversationsList]);

    useEffect(() => {
        setHomePageForUserListFlag(true);
        setHomePageForConversationListFlag(true);
    }, [dashboardType]);
    /* useEffect functions end. */

    /* get unread messages number.  */
    const countUnreadMessages = useCallback(async () => {
        if (conversationsList) {
            setUnreadMessagesCount({});
            for (let conversationUser of conversationsListRef.current) {
                if (
                    conversationUser.conversationId &&
                    conversationUser.user.id
                ) {
                    const res = await fetch(
                        `http://localhost:8000/api/unreadMessagesCount/${conversationUser.conversationId}/${conversationUser.user.id}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (res.status === 200) {
                        const result = await res.json();
                        setUnreadMessagesCount((prevData: any) => ({
                            ...prevData,
                            [conversationUser.user.id]: result.data.length,
                        }));
                    }
                }
            }
        }
    }, [conversationsList]);

    const handleResizeScreenSize = () => {
        if (window.innerWidth < 640) {
            setMenuSectionShowFlag(true);
            setConversationSectionShowFlag(false);
        } else {
            setMenuSectionShowFlag(true);
            setConversationSectionShowFlag(true);
        }
    };

    /* specially this function for mobile device. In this user can come on menu option and it work only if screen width size is smaller than 640px. */
    const backToMenuOption = () => {
        setMenuSectionShowFlag(true);
        setConversationSectionShowFlag(false);
    };

    /* specially this function for mobile device. In this user can come on menu option and it work only if screen width size is smaller than 640px. */
    const goToConversationSection = () => {
        if (window.innerWidth < 640) {
            setMenuSectionShowFlag(false);
            setConversationSectionShowFlag(true);
        }
    };

    /* fetching messages. */
    const fetchMessages = useCallback(
        async (conversationId: string, user: any) => {
            goToConversationSection();
            setCurrentConversationUser({ conversationId, user });
            const res = await fetch(
                `http://localhost:8000/api/message/${conversationId}/${user.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const result = await res.json();
            setMessages(result);
            setHomePageForConversationListFlag(false);
            countUnreadMessages();
        },
        [countUnreadMessages]
    );

    const getAdminUserDetail = useCallback(async (userId: string) => {
        try {
            const res = await fetch(
                `http://localhost:8000/api/user/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                const result = await res.json();
                return result;
            }
            return undefined;
        } catch (error) {
            return error;
        }
    }, []);
    /* set user details to state variable newUserDetails */
    const fetchUser = useCallback(async (userId: string, user: any) => {
        setNewUserDetails({ userId, user });
        setHomePageForUserListFlag(false);
        goToConversationSection();
    }, []);

    /* create conversation. */
    const startConversation = useCallback(
        async (newUserId: string) => {
            try {
                const inputData = {
                    senderId: adminUser.id,
                    receiverId: newUserId,
                };

                const allConversationsRes = await fetch(
                    "http://localhost:8000/api/conversations",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (allConversationsRes.status === 200) {
                    const allConversationsResult =
                        await allConversationsRes.json();
                    // let findConversationFlag = false;
                    // let conversationId = "";
                    let workingData = {
                        findConversationFlag: false,
                        conversationId: "",
                        receiverUser: {
                            id: "",
                            email: "",
                            firstName: "",
                            lastName: "",
                        },
                    };
                    for (let conversation of allConversationsResult) {
                        if (
                            conversation.members.includes(adminUser.id) &&
                            conversation.members.includes(newUserId)
                        ) {
                            workingData.findConversationFlag = true;
                            workingData.conversationId = conversation._id;
                            break;
                        }
                    }

                    // if we don't find the conversation then create new conversation between them.
                    if (!workingData.findConversationFlag) {
                        const res = await fetch(
                            "http://localhost:8000/api/conversation",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(inputData),
                            }
                        );
                        if (res.status === 200) {
                            const newConversationResult = await res.json();
                            workingData.conversationId =
                                newConversationResult.id;
                        }
                    }

                    const receiverUserRes = await fetch(
                        `http://localhost:8000/api/user/${newUserId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (receiverUserRes.status === 200) {
                        const receiverUserData = await receiverUserRes.json();
                        workingData.receiverUser.id = receiverUserData._id;
                        workingData.receiverUser.email = receiverUserData.email;
                        workingData.receiverUser.firstName =
                            receiverUserData.firstName;
                    }
                    showListOfAllConversations();
                    fetchMessages(
                        workingData.conversationId,
                        workingData.receiverUser
                    );
                    setDashboardType((prevState: any) => ({
                        ...prevState,
                        chat: true,
                        user: false,
                    }));
                }
            } catch (error) {
                console.log("Something went wrong: ", error);
            }
        },
        [
            adminUser.id,
            fetchMessages,
            setDashboardType,
            showListOfAllConversations,
        ]
    );

    const divComponent = useMemo(() => {
        return (
            <>
                {adminUser.id ? (
                    <div className="w-screen flex overflow-hidden">
                        {/* I want to make dynamic width */}
                        {menuSectionShowFlag && (
                            <div
                                className={`w-full max-w-[640px] sm:w-1/2 md:w-2/5 h-screen ${
                                    theme === "light"
                                        ? "bg-light-background text-light-text"
                                        : theme === "dark"
                                        ? "bg-dark-background text-dark-text"
                                        : "bg-trueDark-background text-trueDark-text"
                                }`}
                            >
                                <MenuSection
                                    conversationsList={conversationsList}
                                    fetchMessages={fetchMessages}
                                    fetchUser={fetchUser}
                                    showListOfAllConversations={
                                        showListOfAllConversations
                                    }
                                    unreadMessagesCount={unreadMessagesCount}
                                    goToConversationSection={
                                        goToConversationSection
                                    }
                                />
                            </div>
                        )}
                        {conversationSectionShowFlag && (
                            <div
                                className={`w-full sm:w-1/2 md:w-3/5 lg:w-full h-screen flex flex-col items-center ${
                                    theme === "light"
                                        ? "bg-light-options text-light-text"
                                        : theme === "dark"
                                        ? "bg-dark-options text-dark-text"
                                        : "bg-trueDark-options text-trueDark-text"
                                }`}
                            >
                                <ConversationsList
                                    socket={socket}
                                    currentConversationUser={
                                        currentConversationUser
                                    }
                                    messages={messages}
                                    setMessages={setMessages}
                                    newUserDetails={newUserDetails}
                                    homePageForUserListFlag={
                                        homePageForUserListFlag
                                    }
                                    homePageForConversationListFlag={
                                        homePageForConversationListFlag
                                    }
                                    startConversation={startConversation}
                                    backToMenuOption={backToMenuOption}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p>
                        <Image
                            src={Loader}
                            alt={"loader"}
                            width={75}
                            height={75}
                        />
                    </p>
                )}
            </>
        );
    }, [
        adminUser.id,
        conversationSectionShowFlag,
        conversationsList,
        currentConversationUser,
        fetchMessages,
        fetchUser,
        homePageForConversationListFlag,
        homePageForUserListFlag,
        menuSectionShowFlag,
        messages,
        newUserDetails,
        showListOfAllConversations,
        socket,
        startConversation,
        theme,
        unreadMessagesCount,
    ]);

    return divComponent;
};
export default Dashboard;
