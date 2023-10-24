import React, { useEffect, useState } from "react";
import AvatarIcon from "@/public/assets/avatar.svg";
import PhoneIcon from "@/public/assets/phone.svg";
import SendIcon from "@/public/assets/send.svg";
import CirclePlusIcon from "@/public/assets/circlePlus.svg";
import UsersIcon from "@/public/assets/users.svg";
import MessagesIcon from "@/public/assets/messages.svg";
import Image from "next/image";
import Input from "@/src/components/input";
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
    }, []);

    useEffect(() => {
        console.log("user data", adminUser);
        console.log("conversation data", currentConversationUser);
    }, [adminUser, currentConversationUser]);

    /* fetching messages. */
    const fetchMessages = async (conversationId: string, user: any) => {
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
        console.log("result messages ->", result);
        setMessages(result);
    };

    /* set user details to state variable newUserDetails */
    const fetchUser = async (userId: string, user: any) => {
        setNewUserDetails({ userId, user });
        sethHomePageForUserListFlag(false);
    };

    /* create conversation. */
    const startConversation = async (newUserId: string) => {
        // console.log("get userId",userId);
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
                console.log("workingData",workingData);
                fetchMessages(workingData.conversationId, workingData.receiverUser);
                setShowUsersFlag(false);
            }
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    return (
        <div className="w-screen flex">
            <div className="w-1/4 h-screen bg-secondary">
                <MenuSection
                    adminUser={adminUser}
                    fetchMessages={fetchMessages}
                    showUsersFlag={showUsersFlag}
                    setShowUsersFlag={setShowUsersFlag}
                    fetchUser={fetchUser}
                />
            </div>
            <div className="w-3/4 h-screen bg-white flex flex-col items-center">
                <ConversationsList
                    adminUser={adminUser}
                    showUsersFlag={showUsersFlag}
                    currentConversationUser={currentConversationUser}
                    messages={messages}
                    newUserDetails={newUserDetails}
                    homePageForUserListFlag={homePageForUserListFlag}
                    startConversation={startConversation}
                />
            </div>
        </div>
    );
};

export default Dashboard;
