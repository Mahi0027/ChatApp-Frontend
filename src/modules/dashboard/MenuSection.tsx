import React, { useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import UsersIcon from "@/public/assets/users.svg";
import MessagesIcon from "@/public/assets/messages.svg";

type ListOfAllUserType = {
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}[];

type ConversationsListType = {
    conversationId: string;
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}[];

type MenuSectionType = {
    adminUser: any;
    fetchMessages: (arg0: string, arg1: any) => void;
    showUsersFlag: boolean;
    setShowUsersFlag: (arg0: boolean) => void;
    fetchUser: (arg0: string, arg1: any) => void;
};
const MenuSection = ({
    adminUser,
    fetchMessages,
    showUsersFlag,
    setShowUsersFlag,
    fetchUser,
}: MenuSectionType) => {
    const [listOfAllUsers, setListOfAllUsers] = useState<ListOfAllUserType>([
        {
            user: {
                id: "",
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
                    id: "",
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
        setListOfAllUsers(result);
        setShowUsersFlag(true);
    };

    return (
        <>
            <div className="flex items-center my-8 mx-2">
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

            <div className="h-4/5 md:h-4/5 mx-2 mt-10">
                <div className="text-primary text-lg">
                    {showUsersFlag ? "Users" : "Chats"}
                </div>
                <div className="h-full overflow-y-auto scroll-smooth pb-10">
                    {showUsersFlag ? (
                        <>
                            {listOfAllUsers.length > 0 ? (
                                listOfAllUsers.map(
                                    ({ user }, index: number) => {
                                        if (user.id !== adminUser?.id) {
                                            return (
                                                <div
                                                    className="py-6 border-b border-b-gray-300"
                                                    key={index}
                                                >
                                                    <div
                                                        className="cursor-pointer flex items-center"
                                                        onClick={() => {
                                                            fetchUser(
                                                                user.id,
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
