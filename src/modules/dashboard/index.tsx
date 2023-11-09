import React, { useContext, useEffect, useRef, useState } from "react";
import MenuSection from "./MenuSection";
import ConversationsList from "./ConversationsList";
import { io } from "socket.io-client";
import { dashboardContext, primaryContext } from "@/src/context";

type adminUserType = {
    id: string;
    email: string;
    fullName: string;
};

type CurrentConversationUserType = {
    conversationId: string;
    user: {
        id: string;
        email: string;
        fullName: string;
    };
};

type NewUserDetailsType = {
    userId: string;
    user: {
        email: string;
        fullName: string;
    };
};

type ConversationsListType = {
    conversationId: string;
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}[];

const Dashboard = () => {
    const [socket, setSocket] = useState<any | null>(null);
    const { setActiveUsers } = useContext(primaryContext);

    const { dashboardType, setDashboardType } =
        useContext(
            dashboardContext
        ); /* it's for show/hide user/message icon. */
    const [homePageForUserListFlag, setHomePageForUserListFlag] =
        useState<boolean>(true); /* home page for user list content side */
    const [
        homePageForConversationListFlag,
        setHomePageForConversationListFlag,
    ] =
        useState<boolean>(
            true
        ); /* home page for conversation list content side */

    const [adminUser, setAdminUser] = useState<adminUserType>({
        id: "",
        email: "",
        fullName: "",
    }); /* admin user */
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
            user: { id: "", email: "", fullName: "" },
        }); /* store current user details with whom admin user is talking. */
    const currentConversationUserRef = useRef<CurrentConversationUserType>(
        currentConversationUser
    ); /* store current user details with whom admin user is talking in ref for using in socket. */
    const [newUserDetails, setNewUserDetails] = useState<NewUserDetailsType>({
        userId: "",
        user: {
            email: "",
            fullName: "",
        },
    });
    const [conversationsList, setConversationsList] =
        useState<ConversationsListType>([
            {
                conversationId: "",
                user: {
                    id: "",
                    email: "",
                    fullName: "",
                },
            },
        ]);
    const conversationsListRef =
        useRef<ConversationsListType>(conversationsList);

    useEffect(() => {
        /* create socket user */
        setSocket(io("http://localhost:8080"));

        setAdminUser(
            typeof localStorage !== "undefined"
                ? JSON.parse(localStorage.getItem("user:detail") || "null") ?? {
                      id: "",
                      email: "",
                      fullName: "",
                  }
                : { id: "", email: "", fullName: "" }
        );

        showListOfAllConversations();

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
    }, []);

    useEffect(() => {
        currentConversationUserRef.current = currentConversationUser;
    }, [currentConversationUser]);

    useEffect(() => {
        conversationsListRef.current = conversationsList;
    }, [conversationsList]);

    useEffect(() => {
        socket?.emit("addUser", adminUser?.id);
        socket?.on("getUsers", (activeUsers: any) => {
            setActiveUsers(activeUsers);
        });
        socket?.on(
            "getMessage",
            async ({
                conversationId,
                senderId,
                message,
                receiver,
            }: {
                conversationId: string;
                senderId: string;
                message: string;
                receiver: any;
            }) => {
                setMessages((prevData: any) => [
                    ...prevData,
                    {
                        user: {
                            id: currentConversationUserRef.current.user.id,
                            email: currentConversationUserRef.current.user
                                .email,
                            fullName:
                                currentConversationUserRef.current.user
                                    .fullName,
                        },
                        message: message,
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
    }, [socket]);

    useEffect(() => {
        countUnreadMessages();
    }, [adminUser, conversationsList]);

    useEffect(() => {
        setHomePageForUserListFlag(true);
        setHomePageForConversationListFlag(true);
    }, [dashboardType]);

    /* get unread messages number.  */
    const countUnreadMessages = async () => {
        if (conversationsList) {
            setUnreadMessagesCount({});
            for (let conversationUser of conversationsListRef.current) {
                if (
                    conversationUser?.conversationId !== "" &&
                    conversationUser?.user?.id !== ""
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
    };

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
    const fetchMessages = async (conversationId: string, user: any) => {
        goToConversationSection;
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
    };

    /* set user details to state variable newUserDetails */
    const fetchUser = async (userId: string, user: any) => {
        setNewUserDetails({ userId, user });
        setHomePageForUserListFlag(false);
        goToConversationSection();
    };

    /* create conversation. */
    const startConversation = async (newUserId: string) => {
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
                const allConversationsResult = await allConversationsRes.json();
                // let findConversationFlag = false;
                // let conversationId = "";
                let workingData = {
                    findConversationFlag: false,
                    conversationId: "",
                    receiverUser: {
                        id: "",
                        email: "",
                        fullName: "",
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
                        workingData.conversationId = newConversationResult.id;
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
                    workingData.receiverUser.fullName =
                        receiverUserData.fullName;
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
    };

    /* show list of all conversations. */
    const showListOfAllConversations = async () => {
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
    };

    return (
        <div className="w-screen flex overflow-hidden">
            {/* I want to make dynamic width */}
            {menuSectionShowFlag && (
                <div className="w-full max-w-[640px] sm:w-1/2 md:w-2/5 h-screen bg-secondary">
                    <MenuSection
                        adminUser={adminUser}
                        conversationsList={conversationsList}
                        fetchMessages={fetchMessages}
                        fetchUser={fetchUser}
                        showListOfAllConversations={showListOfAllConversations}
                        unreadMessagesCount={unreadMessagesCount}
                        goToConversationSection={goToConversationSection}
                    />
                </div>
            )}
            {conversationSectionShowFlag && (
                <div className="w-full sm:w-1/2 md:w-3/5 lg:w-full h-screen bg-white flex flex-col items-center">
                    <ConversationsList
                        adminUser={adminUser}
                        socket={socket}
                        currentConversationUser={currentConversationUser}
                        messages={messages}
                        setMessages={setMessages}
                        newUserDetails={newUserDetails}
                        homePageForUserListFlag={homePageForUserListFlag}
                        homePageForConversationListFlag={
                            homePageForConversationListFlag
                        }
                        startConversation={startConversation}
                        backToMenuOption={backToMenuOption}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
