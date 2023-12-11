import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import Input from "@/src/components/input";
import { dashboardContext } from "@/src/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBan,
    faComment,
    faComments,
    faHome,
    faPeopleGroup,
    faUserAlt,
    faUserGroup,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ListOfAllUserType } from "@/src/pages";

type MenuSectionType = {
    conversationsList: any;
    fetchMessages: (
        arg0: string,
        groupName: string,
        arg1: boolean,
        arg2: any
    ) => void;
    fetchUser: (arg0: string, arg1: any) => void;
    showListOfAllConversations: () => void;
    unreadMessagesCount: any;
    unreadGroupMessagesCount: any;
    goToConversationSection: () => void;
    createNewGroup: () => void;
};
/* define type of status end. */

const MenuSection = ({
    conversationsList,
    fetchMessages,
    fetchUser,
    showListOfAllConversations,
    unreadMessagesCount,
    unreadGroupMessagesCount,
    goToConversationSection,
    createNewGroup,
}: MenuSectionType) => {
    /* context declaration start. */
    const {
        dashboardType,
        setDashboardType,
        settingPage,
        setSettingPage,
        adminUser,
        listOfAllUsers,
        setListOfAllUsers,
        theme,
    } = useContext(dashboardContext);
    /* context declaration end. */
    const [searchedListOfAllUsers, setSearchedListOfAllUsers] =
        useState<ListOfAllUserType>(listOfAllUsers);
    const [searchedConversationsList, setSearchedConversationsList] =
        useState<any>(conversationsList);
    const [searchText, setSearchText] = useState<string>("");
    const [chosenListOfItem, setChosenListOfItem] = useState(-2);
    /* state variable declaration end. */

    /* useEffect functions start. */
    useEffect(() => {
        if (dashboardType.user) showListOfAllUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setSearchedListOfAllUsers(listOfAllUsers);
    }, [listOfAllUsers]);

    useEffect(() => {
        setChosenListOfItem(-2);
    }, [dashboardType]);

    useEffect(() => {
        setSearchedConversationsList(conversationsList);
    }, [conversationsList]);

    useEffect(() => {
        if (searchText) {
            const filterConversationsList = conversationsList.filter(
                (conversation: any) => {
                    if (conversation.isGroup) {
                        return conversation.groupName
                            .toLowerCase()
                            .includes(searchText.toLowerCase());
                    } else {
                        return conversation.users[0].firstName
                            .toLowerCase()
                            .includes(searchText.toLowerCase());
                    }
                }
            );
            setSearchedConversationsList(filterConversationsList);

            const filterUsersList = listOfAllUsers.filter((user: any) => {
                if (user.user.firstName) {
                    return user.user.firstName
                        .toLowerCase()
                        .includes(searchText.toLowerCase());
                }
            });
            setSearchedListOfAllUsers(filterUsersList);
        } else {
            setSearchedListOfAllUsers(listOfAllUsers);
            setSearchedConversationsList(conversationsList);
        }
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
                            className={`object-cover w-16 h-16 rounded-full ${
                                theme !== "light" && !adminUser.profileImage
                                    ? "invert"
                                    : ""
                            }`}
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
                            className="ml-auto p-2 cursor-pointer"
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
                            <FontAwesomeIcon
                                icon={faComments}
                                style={{
                                    color: theme! == "light" ? "#000" : "#fff",
                                }}
                                size="2xl"
                            />
                        </div>
                    ) : (
                        <div
                            className="ml-auto p-2 cursor-pointer"
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
                            <FontAwesomeIcon
                                icon={faUsers}
                                style={{
                                    color: theme! == "light" ? "#000" : "#fff",
                                }}
                                size="2xl"
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
                            <div
                                className={`py-6 border-b ${
                                    theme === "light"
                                        ? "border-b-gray-300"
                                        : "border-b-gray-700"
                                } ${
                                    chosenListOfItem === -1
                                        ? `sm:shadow-sm sm:rounded-lg ${
                                              theme === "light"
                                                  ? "sm:bg-light-options text-light-text"
                                                  : theme === "dark"
                                                  ? "sm:bg-dark-options text-dark-text"
                                                  : "sm:bg-trueDark-options text-trueDark-text"
                                          }`
                                        : ""
                                }`}
                            >
                                <div
                                    className={`cursor-pointer flex items-center justify-center text-orange-400`}
                                    onClick={() => {
                                        setChosenListOfItem(-1);
                                        createNewGroup();
                                    }}
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faUserGroup}
                                            style={{
                                                color: "#FB923C",
                                            }}
                                            size="2xl"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg">
                                            Create Group
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {searchedListOfAllUsers.length > 0 ? (
                                searchedListOfAllUsers.map(
                                    ({ user }, index: number) => {
                                        if (user.id !== adminUser?.id) {
                                            return (
                                                <div
                                                    className={`py-6 border-b ${
                                                        theme === "light"
                                                            ? "border-b-gray-300"
                                                            : "border-b-gray-700"
                                                    } ${
                                                        chosenListOfItem ===
                                                        index
                                                            ? `sm:shadow-sm sm:rounded-lg ${
                                                                  theme ===
                                                                  "light"
                                                                      ? "sm:bg-light-options text-light-text"
                                                                      : theme ===
                                                                        "dark"
                                                                      ? "sm:bg-dark-options text-dark-text"
                                                                      : "sm:bg-trueDark-options text-trueDark-text"
                                                              }`
                                                            : ""
                                                    }`}
                                                    key={index}
                                                >
                                                    <div
                                                        className={`cursor-pointer flex items-center px-2`}
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
                                                                className={`object-cover w-14 h-14 rounded-full ${
                                                                    theme !==
                                                                        "light" &&
                                                                    !user.profileImage
                                                                        ? "invert"
                                                                        : ""
                                                                }`}
                                                                src={
                                                                    user.profileImage
                                                                        ? user.profileImage
                                                                        : AvatarIcon
                                                                }
                                                                alt={
                                                                    "AvatarIcon"
                                                                }
                                                                width={50}
                                                                height={20}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-lg">
                                                                {
                                                                    user?.firstName
                                                                }{" "}
                                                                {user?.lastName}
                                                            </h3>
                                                            <p className="text-sm font-light">
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
                                            groupName,
                                            isGroup,
                                            users,
                                        }: {
                                            conversationId: string;
                                            groupName: string;
                                            isGroup: boolean;
                                            users: any;
                                        },
                                        index: number
                                    ) => {
                                        if (isGroup) {
                                            return (
                                                <div
                                                    className={`py-6 border-b ${
                                                        theme === "light"
                                                            ? "border-b-gray-300"
                                                            : "border-b-gray-700"
                                                    } ${
                                                        chosenListOfItem ===
                                                        index
                                                            ? `sm:shadow-sm sm:rounded-lg ${
                                                                  theme ===
                                                                  "light"
                                                                      ? "sm:bg-light-options text-light-text"
                                                                      : theme ===
                                                                        "dark"
                                                                      ? "sm:bg-dark-options text-dark-text"
                                                                      : "sm:bg-trueDark-options text-trueDark-text"
                                                              }`
                                                            : ""
                                                    }`}
                                                    key={index}
                                                >
                                                    <div
                                                        className="cursor-pointer flex items-center px-2"
                                                        onClick={() => {
                                                            setChosenListOfItem(
                                                                index
                                                            );
                                                            fetchMessages(
                                                                conversationId,
                                                                groupName,
                                                                isGroup,
                                                                users
                                                            );
                                                        }}
                                                    >
                                                        <div>
                                                            <FontAwesomeIcon
                                                                className="w-12 h-12 mx-1"
                                                                icon={
                                                                    faPeopleGroup
                                                                }
                                                                style={{
                                                                    color:
                                                                        theme! ==
                                                                        "light"
                                                                            ? "#000"
                                                                            : "#fff",
                                                                }}
                                                                size="xl"
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-lg">
                                                                {groupName}
                                                            </h3>
                                                        </div>
                                                        <div className="ml-auto text-sm text-white border border-orange-600 rounded-full px-1 bg-orange-600">
                                                            Group
                                                        </div>
                                                        {/* I need to work on unread messages. */}
                                                        {/* {unreadGroupMessagesCount[
                                                            conversationId
                                                        ] > 0 && (
                                                            <div className="ml-auto mx-10  bg-blue-400 rounded-xl px-2 text-sm text-white">
                                                                {
                                                                    unreadGroupMessagesCount[
                                                                        conversationId
                                                                    ]
                                                                }
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    className={`py-6 border-b ${
                                                        theme === "light"
                                                            ? "border-b-gray-300"
                                                            : "border-b-gray-700"
                                                    } ${
                                                        chosenListOfItem ===
                                                        index
                                                            ? `sm:shadow-sm sm:rounded-lg ${
                                                                  theme ===
                                                                  "light"
                                                                      ? "sm:bg-light-options text-light-text"
                                                                      : theme ===
                                                                        "dark"
                                                                      ? "sm:bg-dark-options text-dark-text"
                                                                      : "sm:bg-trueDark-options text-trueDark-text"
                                                              }`
                                                            : ""
                                                    }`}
                                                    key={index}
                                                >
                                                    <div
                                                        className="cursor-pointer flex items-center px-2"
                                                        onClick={() => {
                                                            setChosenListOfItem(
                                                                index
                                                            );
                                                            fetchMessages(
                                                                conversationId,
                                                                groupName,
                                                                isGroup,
                                                                users
                                                            );
                                                        }}
                                                    >
                                                        <div>
                                                            <Image
                                                                className={`object-cover w-14 h-14 rounded-full ${
                                                                    theme !==
                                                                        "light" &&
                                                                    !users[0]
                                                                        .profileImage
                                                                 ? 'invert':''}`}
                                                                src={
                                                                    users[0]
                                                                        .profileImage
                                                                        ? users[0]
                                                                              .profileImage
                                                                        : AvatarIcon
                                                                }
                                                                alt={
                                                                    "AvatarIcon"
                                                                }
                                                                width={50}
                                                                height={50}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-lg">
                                                                {
                                                                    users[0]
                                                                        ?.firstName
                                                                }{" "}
                                                                {
                                                                    users[0]
                                                                        ?.lastName
                                                                }
                                                            </h3>
                                                            {/* <p className="text-sm font-light text-gray-500">
                                                                {user?.email}
                                                            </p> */}
                                                        </div>
                                                        {unreadMessagesCount[
                                                            users[0]?.id
                                                        ] > 0 && (
                                                            <div className="ml-auto mx-10  bg-blue-400 rounded-xl px-2 text-sm text-white">
                                                                {
                                                                    unreadMessagesCount[
                                                                        users[0]
                                                                            .id
                                                                    ]
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
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
                                className={`py-6 border-b ${
                                    theme === "light"
                                        ? "border-b-gray-300"
                                        : "border-b-gray-700"
                                } ${
                                    settingPage.profile &&
                                    `sm:shadow-sm sm:rounded-lg ${
                                        theme === "light"
                                            ? "sm:bg-light-options text-light-text"
                                            : theme === "dark"
                                            ? "sm:bg-dark-options text-dark-text"
                                            : "sm:bg-trueDark-options text-trueDark-text"
                                    }`
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center mx-5 sm:mx-10"
                                    onClick={() => {
                                        handleSettingPage("profile");
                                        goToConversationSection();
                                    }}
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faUserAlt}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="xl"
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
                                className={`py-6 border-b ${
                                    theme === "light"
                                        ? "border-b-gray-300"
                                        : "border-b-gray-700"
                                } ${
                                    settingPage.general &&
                                    `sm:shadow-sm sm:rounded-lg ${
                                        theme === "light"
                                            ? "sm:bg-light-options text-light-text"
                                            : theme === "dark"
                                            ? "sm:bg-dark-options text-dark-text"
                                            : "sm:bg-trueDark-options text-trueDark-text"
                                    }`
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center mx-5 sm:mx-10"
                                    onClick={() => {
                                        handleSettingPage("general");
                                        goToConversationSection();
                                    }}
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faHome}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="xl"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg">General</h3>
                                    </div>
                                </div>
                            </div>
                            {/* <div
                                className={`py-6 border-b ${
                                    theme === "light"
                                        ? "border-b-gray-300"
                                        : "border-b-gray-700"
                                } ${
                                    settingPage.chats &&
                                    `sm:shadow-sm sm:rounded-lg ${
                                        theme === "light"
                                            ? "sm:bg-light-options text-light-text"
                                            : theme === "dark"
                                            ? "sm:bg-dark-options text-dark-text"
                                            : "sm:bg-trueDark-options text-trueDark-text"
                                    }`
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center mx-5 sm:mx-10"
                                    onClick={() => {
                                        handleSettingPage("chats");
                                        goToConversationSection();
                                    }}
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faComment}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="xl"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg">Chats</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`py-6 border-b ${
                                    theme === "light"
                                        ? "border-b-gray-300"
                                        : "border-b-gray-700"
                                } ${
                                    settingPage.help &&
                                    `sm:shadow-sm sm:rounded-lg ${
                                        theme === "light"
                                            ? "sm:bg-light-options text-light-text"
                                            : theme === "dark"
                                            ? "sm:bg-dark-options text-dark-text"
                                            : "sm:bg-trueDark-options text-trueDark-text"
                                    }`
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center mx-5 sm:mx-10"
                                    onClick={() => {
                                        handleSettingPage("help");
                                        goToConversationSection();
                                    }}
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faHandshake}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="xl"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg">Help</h3>
                                    </div>
                                </div>
                            </div> */}
                            <div
                                className={`py-6 border-b ${
                                    theme === "light"
                                        ? "border-b-gray-300"
                                        : "border-b-gray-700"
                                } ${
                                    settingPage.logout &&
                                    `sm:shadow-sm sm:rounded-lg ${
                                        theme === "light"
                                            ? "sm:bg-light-options text-light-text"
                                            : theme === "dark"
                                            ? "sm:bg-dark-options text-dark-text"
                                            : "sm:bg-trueDark-options text-trueDark-text"
                                    }`
                                }`}
                            >
                                <div
                                    className="cursor-pointer flex items-center mx-5 sm:mx-10"
                                    onClick={() => {
                                        handleSettingPage("logout");
                                        goToConversationSection();
                                    }}
                                >
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faBan}
                                            style={{
                                                color: "rgb(248 113 113 / var(--tw-text-opacity))",
                                            }}
                                            size="xl"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg text-red-400">
                                            Log Out
                                        </h3>
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
