import React, { useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import UsersIcon from "@/public/assets/users.svg";
import MessagesIcon from "@/public/assets/messages.svg";

type ListOfAllUserType = {
    userId: string;
    user: {
        email: string;
        fullName: string;
    };
}[];

type ConversationsListType = {
    conversationId: string;
    user: {
        email: string;
        fullName: string;
    };
}[];

const MenuSection = ({
    adminUser,
    fetchMessages,
    showUsersFlag,
    setShowUsersFlag,
    fetchUser,
}) => {
    const [listOfAllUsers, setListOfAllUsers] = useState<ListOfAllUserType>([
        {
            userId: "",
            user: {
                email: "",
                fullName: "",
            },
        },
    ]);
    const [conversationsList, setConversationsList] =
        useState<ConversationsListType>([
            {
                conversationId: "",
                user: {
                    email: "",
                    fullName: "",
                },
            },
        ]);

    useEffect(() => {
        showListOfAllConversations();
    }, []);

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
        console.log("conversation list: ", result);

        setConversationsList(result);
        setShowUsersFlag(false);
    };

    /* show list of all users */
    const showListOfAllUser = async () => {
        const res = await fetch("http://localhost:8000/api/users", {
            method: "GET",
            headers: {
                Content_Type: "application/json",
            },
        });
        const result = await res.json();
        console.log("all users: ", result);
        setListOfAllUsers(result);
        setShowUsersFlag(true);
    };

    return (
        <>
            <div className="flex items-center m-8">
                <div className="border border-primary p-[2px] rounded-full">
                    <Image
                        src={AvatarIcon}
                        width={50}
                        height={50}
                        alt={"AvatarIcon"}
                    />
                </div>
                <div className="ml-4">
                    <h3 className="text-2xl">
                        {adminUser.fullName ? adminUser.fullName : ""}
                    </h3>
                    <p className="text-lg font-light">My Account</p>
                </div>
                {showUsersFlag ? (
                    <div
                        className="ml-auto p-2 cursor-pointer bg-secondary rounded-full"
                        onClick={showListOfAllConversations}
                    >
                        <Image
                            src={MessagesIcon}
                            width={30}
                            height={30}
                            alt={"messageIcon"}
                        />
                    </div>
                ) : (
                    <div
                        className="ml-auto p-2 cursor-pointer bg-secondary rounded-full"
                        onClick={showListOfAllUser}
                    >
                        <Image
                            src={UsersIcon}
                            width={30}
                            height={30}
                            alt={"UsersIcon"}
                        />
                    </div>
                )}
            </div>
            <hr />

            <div className="h-3/4 mx-10 mt-10">
                <div className="text-primary text-lg">
                    {showUsersFlag ? "Users" : "Chats"}
                </div>
                <div className="h-5/6 overflow-y-auto scroll-smooth">
                    {showUsersFlag ? (
                        <>
                            {listOfAllUsers.length > 0 ? (
                                listOfAllUsers.map(
                                    ({ userId, user }, index: number) => {
                                        if (userId !== adminUser?.id) {
                                            return (
                                                <div
                                                    className="py-6 border-b border-b-gray-300"
                                                    key={index}
                                                >
                                                    <div
                                                        className="cursor-pointer flex items-center"
                                                        onClick={() => {
                                                            fetchUser(
                                                                userId,
                                                                user
                                                            );
                                                        }}
                                                    >
                                                        <div>
                                                            <Image
                                                                src={AvatarIcon}
                                                                alt={
                                                                    "AvatarIcon"
                                                                }
                                                                width={50}
                                                                height={50}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-lg">
                                                                {user?.fullName}
                                                            </h3>
                                                            <p className="text-sm font-light text-gray-500">
                                                                {user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }
                                )
                            ) : (
                                <div className="text-center text-lg font-semibold mt-24">
                                    No Users
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {conversationsList.length > 0 ? (
                                conversationsList.map(
                                    (
                                        { conversationId, user },
                                        index: number
                                    ) => {
                                        return (
                                            <div
                                                className="py-6 border-b border-b-gray-300"
                                                key={index}
                                            >
                                                <div
                                                    className="cursor-pointer flex items-center"
                                                    onClick={() => {
                                                        fetchMessages(
                                                            conversationId,
                                                            user
                                                        );
                                                    }}
                                                >
                                                    <div>
                                                        <Image
                                                            src={AvatarIcon}
                                                            alt={"AvatarIcon"}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg">
                                                            {user?.fullName}
                                                        </h3>
                                                        <p className="text-sm font-light text-gray-500">
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            ) : (
                                <div className="text-center text-lg font-semibold mt-24">
                                    No Conversations
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default MenuSection;