import React, { useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import UsersIcon from "@/public/assets/users.svg";
import MessagesIcon from "@/public/assets/messages.svg";
import Input from "@/src/components/input";

type ListOfAllUserType = {
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}[];

type MenuSectionType = {
    adminUser: any;
    conversationsList: any;
    fetchMessages: (arg0: string, arg1: any) => void;
    showUsersFlag: boolean;
    setShowUsersFlag: (arg0: boolean) => void;
    fetchUser: (arg0: string, arg1: any) => void;
    showListOfAllConversations: () => void;
    unreadMessagesCount: any;
};
const MenuSection = ({
    adminUser,
    conversationsList,
    fetchMessages,
    showUsersFlag,
    setShowUsersFlag,
    fetchUser,
    showListOfAllConversations,
    unreadMessagesCount,
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
    const [searchedListOfAllUsers, setSearchedListOfAllUsers] =
        useState<ListOfAllUserType>(listOfAllUsers);

    const [searchedConversationsList, setSearchedConversationsList] =
        useState<any>(conversationsList);

    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        if (showUsersFlag) showListOfAllUser();
    }, []);

    useEffect(() => {
        setSearchedListOfAllUsers(listOfAllUsers);
    }, [listOfAllUsers]);

    useEffect(() => {
        setChosenListOfItem(-1);
    }, [showUsersFlag]);

    const [chosenListOfItem, setChosenListOfItem] = useState(-1);

    useEffect(() => {
        const filterConversationsList = conversationsList.filter(
            (conversation: any) =>
                conversation.user.fullName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        );
        setSearchedConversationsList(filterConversationsList);

        const filterUsersList = listOfAllUsers.filter((user: any) =>
            user.user.fullName.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedListOfAllUsers(filterUsersList);
    }, [searchText]);

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
                        onClick={() => {
                            showListOfAllConversations();
                            setSearchText("");
                        }}
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
                        onClick={() => {
                            showListOfAllUser();
                            setSearchText("");
                        }}
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
                <div className="text-primary text-lg mx-2">
                    {showUsersFlag ? "Users" : "Chats"}
                </div>
                <Input
                    name="searchConversation"
                    placeholder="Search or Start new chat"
                    className="w-full my-2"
                    value={searchText}
                    onChange={(e: any) => setSearchText(e.target.value)}
                />
                <div className="h-full overflow-y-auto scroll-smooth pb-10">
                    {showUsersFlag ? (
                        <>
                            {searchedListOfAllUsers.length > 0 ? (
                                searchedListOfAllUsers.map(
                                    ({ user }, index: number) => {
                                        if (user.id !== adminUser?.id) {
                                            return (
                                                <div
                                                    className={`py-6 border-b border-b-gray-300 ${
                                                        chosenListOfItem ===
                                                        index
                                                            ? "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                                            : ""
                                                    }`}
                                                    key={index}
                                                >
                                                    <div
                                                        className={`cursor-pointer flex items-center`}
                                                        onClick={() => {
                                                            setChosenListOfItem(
                                                                index
                                                            );
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
                            {searchedConversationsList.length > 0 ? (
                                searchedConversationsList.map(
                                    (
                                        {
                                            conversationId,
                                            user,
                                        }: {
                                            conversationId: string;
                                            user: any;
                                        },
                                        index: number
                                    ) => {
                                        return (
                                            <div
                                                className={`py-6 border-b border-b-gray-300 ${
                                                    chosenListOfItem === index
                                                        ? "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                                        : ""
                                                }`}
                                                key={index}
                                            >
                                                <div
                                                    className="cursor-pointer flex items-center"
                                                    onClick={() => {
                                                        setChosenListOfItem(
                                                            index
                                                        );
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
                                                        {/* <p className="text-sm font-light text-gray-500">
                                                            {user?.email}
                                                        </p> */}
                                                    </div>
                                                    {unreadMessagesCount[
                                                        user?.id
                                                    ] > 0 && (
                                                        <div className="ml-auto mx-10  bg-blue-400 rounded-xl px-2 text-sm text-white">
                                                            {
                                                                unreadMessagesCount[
                                                                    user.id
                                                                ]
                                                            }
                                                        </div>
                                                    )}
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
