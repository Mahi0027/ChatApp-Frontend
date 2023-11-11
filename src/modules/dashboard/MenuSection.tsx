import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import UsersIcon from "@/public/assets/users.svg";
import MessagesIcon from "@/public/assets/messages.svg";
import Input from "@/src/components/input";
import { dashboardContext } from "@/src/context";

/* define type of status start. */
type ListOfAllUserType = {
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}[];

type MenuSectionType = {
    conversationsList: any;
    fetchMessages: (arg0: string, arg1: any) => void;
    fetchUser: (arg0: string, arg1: any) => void;
    showListOfAllConversations: () => void;
    unreadMessagesCount: any;
    goToConversationSection: () => void;
};
/* define type of status end. */

const MenuSection = ({
    conversationsList,
    fetchMessages,
    fetchUser,
    showListOfAllConversations,
    unreadMessagesCount,
    goToConversationSection,
}: MenuSectionType) => {
    /* context declaration start. */
    const {
        dashboardType,
        setDashboardType,
        settingPage,
        setSettingPage,
        adminUser,
    } = useContext(dashboardContext);
    /* context declaration end. */

    /* state variable declaration start. */
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
    const [chosenListOfItem, setChosenListOfItem] = useState(-1);
    /* state variable declaration end. */

    /* useEffect functions start. */
    useEffect(() => {
        console.log("adminUser", adminUser);
        
        if (dashboardType.user) showListOfAllUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setSearchedListOfAllUsers(listOfAllUsers);
    }, [listOfAllUsers]);

    useEffect(() => {
        setChosenListOfItem(-1);
    }, [dashboardType]);

    useEffect(() => {
        setSearchedConversationsList(conversationsList);
    }, [conversationsList]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);
    /* useEffect functions end. */

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
        // setShowUsersFlag(true);
        setDashboardType((prevState: any) => ({
            ...prevState,
            chat: false,
            user: true,
        }));
    };

    const toggleSettingPage = () => {
        if (dashboardType.setting) {
            setDashboardType((prevState: any) => ({
                ...prevState,
                chat: true,
                user: false,
                setting: false,
            }));
        } else {
            setSettingPage({
                profile: false,
                general: false,
                chats: false,
                help: false,
                logout: false,
            });
            setDashboardType((prevState: any) => ({
                ...prevState,
                chat: false,
                user: false,
                setting: true,
            }));
        }
    };

    const handleSettingPage = (page: string) => {
        setSettingPage({
            profile: page === "profile" ? true : false,
            general: page === "general" ? true : false,
            chats: page === "chats" ? true : false,
            help: page === "help" ? true : false,
            logout: page === "logout" ? true : false,
        });
    };
    return (
        <>
            <div className="flex items-center my-8 mx-2">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleSettingPage}
                >
                    <div>
                        <Image
                            className="object-cover w-16 h-16 rounded-full"
                            src={
                                adminUser.profileImage
                                    ? adminUser.profileImage
                                    : AvatarIcon
                            }
                            width={50}
                            height={50}
                            alt={"AvatarIcon"}
                        />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-2xl">
                            {adminUser.firstName ? adminUser.firstName : ""}{" "}
                            {adminUser.lastName ? adminUser.lastName : ""}
                        </h3>
                        <p className="text-lg font-light">
                            {adminUser.status ? adminUser.status : ""}
                        </p>
                    </div>
                </div>
                {!dashboardType.setting &&
                    (dashboardType.user ? (
                        <div
                            className="ml-auto p-2 cursor-pointer bg-secondary rounded-full"
                            onClick={() => {
                                setDashboardType({
                                    chat: true,
                                    user: false,
                                    setting: false,
                                });
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
                                setDashboardType({
                                    chat: false,
                                    user: true,
                                    setting: false,
                                });
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
                    ))}
            </div>
            <hr />

            <div className="h-4/5 md:h-4/5 mx-2 mt-10">
                <div className="text-primary text-lg mx-2">
                    {dashboardType.user && "Users"}
                    {dashboardType.chat && "Chats"}
                    {dashboardType.setting && "Settings"}
                </div>
                {!dashboardType.setting && (
                    <Input
                        name="searchConversation"
                        placeholder="Search or Start new chat"
                        className="w-full my-2"
                        value={searchText}
                        onChange={(e: any) => setSearchText(e.target.value)}
                    />
                )}
                <div className="h-full overflow-y-auto scroll-smooth pb-10">
                    {/* all users list. */}
                    {dashboardType.user && (
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
                    )}
                    {/* all conversations list. */}
                    {dashboardType.chat && (
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

                    {/* all settings list. */}
                    {dashboardType.setting && (
                        <>
                            <div
                                className={`py-6 border-b border-b-gray-300 ${
                                    settingPage.profile &&
                                    "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center"
                                    onClick={() => {
                                        handleSettingPage("profile");
                                        goToConversationSection();
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
                                            Your Profile
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`py-6 border-b border-b-gray-300 ${
                                    settingPage.general &&
                                    "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center"
                                    onClick={() => {
                                        handleSettingPage("general");
                                        goToConversationSection();
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
                                        <h3 className="text-lg">General</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`py-6 border-b border-b-gray-300 ${
                                    settingPage.chats &&
                                    "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center"
                                    onClick={() => {
                                        handleSettingPage("chats");
                                        goToConversationSection();
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
                                        <h3 className="text-lg">Chats</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`py-6 border-b border-b-gray-300 ${
                                    settingPage.help &&
                                    "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center"
                                    onClick={() => {
                                        handleSettingPage("help");
                                        goToConversationSection();
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
                                        <h3 className="text-lg">Help</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`py-6 border-b border-b-gray-300 ${
                                    settingPage.logout &&
                                    "sm:bg-gray-200 sm:shadow-sm sm:rounded-lg"
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center"
                                    onClick={() => {
                                        handleSettingPage("logout");
                                        goToConversationSection();
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
                                        <h3 className="text-lg">Log Out</h3>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default MenuSection;
