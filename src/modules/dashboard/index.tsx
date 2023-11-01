import React, { useEffect, useState } from "react";
import MenuSection from "./MenuSection";
import ConversationsList from "./ConversationsList";

type adminUserType = {
    id: string;
    email: string;
    fullName: string;
};

type CurrentConversationUserType = {
    conversationId: string;
    user: any;
};

type ListOfAllConversationType = {
    conversationId: string;
    user: {
        email: string;
        fullName: string;
    };
}[];
type NewUserDetailsType = {
    userId: string;
    user: {
        email: string;
        fullName: string;
    };
};

const Dashboard = () => {
    const [adminUser, setAdminUser] = useState<adminUserType>({
        id: "",
        email: "",
        fullName: "",
    });
    const [menuSectionShowFlag, setMenuSectionShowFlag] =
        useState<boolean>(true);
    const [conversationSectionShowFlag, setConversationSectionShowFlag] =
        useState<boolean>(false);
    const [conversations, setConversations] =
        useState<ListOfAllConversationType>([
            {
                conversationId: "",
                user: {
                    email: "",
                    fullName: "",
                },
            },
        ]);
    const [messages, setMessages] = useState([]);
    const [currentConversationUser, setCurrentConversationUser] =
        useState<CurrentConversationUserType>({ conversationId: "", user: {} });
    const [showUsersFlag, setShowUsersFlag] = useState<boolean>(false);
    const [newUserDetails, setNewUserDetails] = useState<NewUserDetailsType>({
        userId: "",
        user: {
            email: "",
            fullName: "",
        },
    });
    const [homePageForUserListFlag, sethHomePageForUserListFlag] =
        useState<boolean>(true);

    useEffect(() => {
        setAdminUser(
            typeof localStorage !== "undefined"
                ? JSON.parse(localStorage.getItem("user:detail") || "null") ?? {
                      id: "",
                      email: "",
                      fullName: "",
                  }
                : { id: "", email: "", fullName: "" }
        );

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
    // useEffect(() => {
    //     console.log("user data", adminUser);
    //     console.log("conversation data", currentConversationUser);
    // }, [adminUser, currentConversationUser]);

    /* fetching messages. */
    const fetchMessages = async (conversationId: string, user: any) => {
        if (window.innerWidth < 640) {
            setMenuSectionShowFlag(false);
            setConversationSectionShowFlag(true);
        }

        setCurrentConversationUser({ conversationId, user });
        const res = await fetch(
            `http://localhost:8000/api/message/${conversationId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await res.json();
        setMessages(result);
    };

    /* set user details to state variable newUserDetails */
    const fetchUser = async (userId: string, user: any) => {
        setNewUserDetails({ userId, user });
        sethHomePageForUserListFlag(false);
        if (window.innerWidth < 640) {
            setMenuSectionShowFlag(false);
            setConversationSectionShowFlag(true);
        }
    };

    /* create conversation. */
    const startConversation = async (newUserId: string) => {
        try {
            const inputData = {
                senderId: adminUser.id,
                receiverId: newUserId,
            };
            console.log("conversation input data:", inputData);

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
                console.log("allConversationsResult", allConversationsResult);
                // let findConversationFlag = false;
                // let conversationId = "";
                let workingData = {
                    findConversationFlag: false,
                    conversationId: "",
                    receiverUser: {
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
                    workingData.receiverUser.email = receiverUserData.email;
                    workingData.receiverUser.fullName =
                        receiverUserData.fullName;
                }
                console.log("workingData", workingData);
                fetchMessages(
                    workingData.conversationId,
                    workingData.receiverUser
                );
                setShowUsersFlag(false);
            }
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    return (
        <div className="w-screen flex overflow-hidden">
            {/* I want to make dynamic width */}
            {menuSectionShowFlag && (
                <div className="w-full max-w-[640px] sm:w-1/2 md:w-2/5 h-screen bg-secondary">
                    <MenuSection
                        adminUser={adminUser}
                        fetchMessages={fetchMessages}
                        showUsersFlag={showUsersFlag}
                        setShowUsersFlag={setShowUsersFlag}
                        fetchUser={fetchUser}
                    />
                </div>
            )}
            {conversationSectionShowFlag && (
                <div className="w-full sm:w-1/2 md:w-3/5 lg:w-full h-screen bg-white flex flex-col items-center">
                    <ConversationsList
                        adminUser={adminUser}
                        showUsersFlag={showUsersFlag}
                        currentConversationUser={currentConversationUser}
                        messages={messages}
                        newUserDetails={newUserDetails}
                        homePageForUserListFlag={homePageForUserListFlag}
                        startConversation={startConversation}
                        backToMenuOption={backToMenuOption}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
