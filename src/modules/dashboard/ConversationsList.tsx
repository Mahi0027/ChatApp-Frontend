import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import Input from "@/src/components/input";
import Button from "@/src/components/button";
import emojis from "@/public/assets/emojis.json";
import { dashboardContext, primaryContext } from "@/src/context";
import Index from "./settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faDownload, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import Selector from "@/src/components/selector";

/* define type of status start. */
type formDatatype = {
    groupName: string;
    users: string[];
};

type ConversationListType = {
    socket: any;
    currentConversationUser: any;
    messages: any;
    setMessages: (arg0: any) => void;
    newUserDetails: any;
    homePageForUserListFlag: boolean;
    homePageForConversationListFlag: boolean;
    startConversation: (arg0: string) => void;
    backToMenuOption: () => void;
    makeGroupFlag: boolean;
};
/* define type of status end. */
const ConversationsList = ({
    socket,
    currentConversationUser,
    messages,
    setMessages,
    newUserDetails,
    homePageForUserListFlag,
    homePageForConversationListFlag,
    startConversation,
    backToMenuOption,
    makeGroupFlag,
}: ConversationListType) => {
    const { activeUsers, setNotificationData } = useContext(primaryContext);
    const { dashboardType, adminUser, listOfAllUsers, theme } =
        useContext(dashboardContext);
    const [text, setText] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("");
    const [showBackOption, setShowBackOption] = useState<boolean>(true);
    const [onlineFlag, setOnlineFlag] = useState<boolean>(false);
    const [formData, setFormData] = useState<formDatatype>({
        groupName: "",
        users: [],
    });
    const [listForSelector, setListForSelector] = useState([]);
    /* ref hook variable declaration start. */
    const containerRef = useRef<any>(null);
    const fileInputRef = useRef<any>(null);
    /* ref hook variable declaration end. */

    useEffect(() => {
        setEmoji(emojis[Math.floor(Math.random() * 320)]);
        if (window.innerWidth < 640) {
            setShowBackOption(true);
        } else {
            setShowBackOption(false);
        }
        scrollToBottom();
    }, []);

    useEffect(() => {
        const listData = listOfAllUsers.map((userData: any) => ({
            id: userData.user.id,
            value: `${userData.user.email} (${
                userData.user.firstName ? userData.user.firstName : ""
            } ${userData.user.lastName ? userData.user.lastName : ""})`,
        }));
        setListForSelector(listData);
    }, [listOfAllUsers]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        var foundOnlineFlag = false;

        for (let activeUser of activeUsers) {
            if (activeUser.userId === currentConversationUser.user.id) {
                setOnlineFlag(true);
                foundOnlineFlag = true;
            }
        }
        if (!foundOnlineFlag) setOnlineFlag(false);
    }, [activeUsers, currentConversationUser.user.id]);
    // Function to scroll to the bottom of the container

    /* for sending image */
    const handleEditClick = () => {
        fileInputRef.current.click(); // Trigger the file input
    };

    const handleImageInputChange = (event: any) => {
        const selectedFile = event.target.files[0]; // Get the selected file

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const img = document.createElement("img");
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxWidth = 300;
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedDataURL = canvas.toDataURL(
                        "image/jpeg",
                        0.5
                    );
                    sendMessage("image", compressedDataURL);
                };
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    /* send message */
    const sendMessage = async (type = "text", data = "") => {
        const currentTime = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const inputData = {
            conversationId: currentConversationUser?.conversationId,
            senderId: adminUser?.id,
            message: type === "image" ? data : text,
            type: type,
            timeStamp: currentTime,
            receiverId: currentConversationUser?.user?.id,
        };

        setMessages((prevData: any) => [
            ...prevData,
            {
                user: {
                    id: adminUser.id,
                    email: adminUser.email,
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                },
                message: type === "image" ? data : text,
                timeStamp: currentTime,
                type: type,
            },
        ]);

        socket?.emit("sendMessage", inputData);
        setText("");
        const res = await fetch("http://localhost:8000/api/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });
        if (res.status === 200) {
            const result = await res.json();
        } else {
            console.log("invalid inputs");
        }
    };

    /* download chat image. */
    const handleDownloadImage = (index: number) => {
        const link = document.createElement("a");
        link.href = messages[index].message;
        link.download = `downloadedChatImage-${new Date().getTime()}.jpg`;
        link.click();
    };

    const handleCreateGroupSubmitForm = async (e: any) => {
        e.preventDefault();

        const inputData = {
            groupName: formData.groupName,
            adminId: adminUser.id,
            userIds: formData.users,
        };
        const res = await fetch("http://localhost:8000/api/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });
        const result = await res.json();
        setNotificationData((prevData: any) => ({
            ...prevData,
            type: result.type,
            heading: result.heading,
            message: result.message,
            status: true,
        }));
    };

    return (
        <>
            {showBackOption && (
                <div
                    className="fixed top-0 left-5 font-bold text-5xl cursor-pointer"
                    onClick={backToMenuOption}
                >
                    &#8592;
                </div>
            )}
            {/* user related content board. */}
            {dashboardType.user &&
                (makeGroupFlag ? (
                    <div className="m-8 w-full h-full flex justify-center items-center">
                        <form
                            className={`w-[90%] max-h-[80%] mt-14 mb-0.5 rounded-lg shadow-lg ${
                                theme === "light"
                                    ? "bg-light-background text-light-text"
                                    : theme === "dark"
                                    ? "bg-dark-background text-dark-text"
                                    : "bg-trueDark-background text-trueDark-text"
                            }`}
                            onSubmit={(e) => {
                                handleCreateGroupSubmitForm(e);
                            }}
                        >
                            <div className="m-8">
                                <div className="flex flex-col md:flex-row  mb-2">
                                    <div className="w-full flex justify-center">
                                        <Input
                                            label="Group Name"
                                            name="groupName"
                                            placeholder="Enter your group name"
                                            isRequired={true}
                                            value={formData.groupName}
                                            onChange={(e: any) => {
                                                setFormData(
                                                    (prevData: any) => ({
                                                        ...prevData,
                                                        groupName:
                                                            e.target.value,
                                                    })
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <Selector
                                        label="Choose Users"
                                        name="ChooseUsers"
                                        placeholder="Search User"
                                        value={listForSelector}
                                        setSelectedListData={setFormData}
                                    />
                                </div>
                                <hr className="my-5" />
                                <div className="flex flex-col md:flex-row mb-5">
                                    <div className="w-full flex justify-center my-2 md:my-0">
                                        <Button
                                            label="Submit"
                                            type="submit"
                                            className={`w-full mx-2 bg-green-300 text-sm hover:text-white hover:bg-green-400 ${
                                                theme !== "light"
                                                    ? "text-black"
                                                    : "text-white"
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : homePageForUserListFlag ? (
                    <div className="h-3/4 w-full flex flex-col justify-center">
                        <div className="text-center text-lg font-semibold px-5">
                            No conversation selected yet. Please choose user and
                            start conversation.
                        </div>
                        <div className="text-center text-3xl mt-5">{emoji}</div>
                    </div>
                ) : (
                    <div className="h-3/4 w-full flex flex-col justify-center items-center">
                        <div className="text-center">
                            <div className="flex flex-col justify-center items-center m-10">
                                <Image
                                    className="object-cover w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full"
                                    src={
                                        newUserDetails.user.profileImage
                                            ? newUserDetails.user.profileImage
                                            : AvatarIcon
                                    }
                                    width={400}
                                    height={400}
                                    alt={"AvatarIcon"}
                                />
                            </div>
                            <div className="text-lg font-semibold">
                                {newUserDetails?.user?.firstName}{" "}
                                {newUserDetails?.user?.lastName}
                            </div>
                            <div className="text-md">
                                {newUserDetails?.user.email}
                            </div>
                        </div>
                        <div className="text-center mt-20">
                            <Button
                                label={`Start Conversation with ${
                                    newUserDetails?.user?.firstName
                                } ${
                                    newUserDetails.user.lastName
                                        ? newUserDetails.user.lastName
                                        : ""
                                }`}
                                type="button"
                                className="w-full mb-2 bg-primary hover:bg-primary text-sm transform transition-transform hover:scale-105"
                                onClick={() =>
                                    startConversation(newUserDetails?.userId)
                                }
                            />
                        </div>
                    </div>
                ))}

            {/* conversation related content board. */}
            {dashboardType.chat && (
                <>
                    {!homePageForConversationListFlag ? (
                        <>
                            {/* current chat user name and status. */}
                            {currentConversationUser.isGroup
                                ? currentConversationUser.groupName && (
                                      <div
                                          className={`w-4/5 sm:w-3/4 h-[80px] mt-14 mb-0.5  rounded-full flex items-center px-2 md:px-6 ${
                                              theme === "light"
                                                  ? "bg-light-background"
                                                  : theme === "dark"
                                                  ? "bg-dark-background"
                                                  : "bg-trueDark-background"
                                          }`}
                                      >
                                          <div className="cursor-pointer">
                                              <Image
                                                  className={`object-cover w-14 h-14 rounded-full ${
                                                      theme !== "light"
                                                          ? "invert"
                                                          : ""
                                                  }`}
                                                  src={AvatarIcon}
                                                  alt={"AvatarIcon"}
                                                  width={50}
                                                  height={50}
                                              />
                                          </div>
                                          <div className="ml-2 mr-auto">
                                              <h3 className="text-lg">
                                                  {
                                                      currentConversationUser.groupName
                                                  }
                                              </h3>
                                          </div>
                                      </div>
                                  )
                                : currentConversationUser.user.firstName && (
                                      <div
                                          className={`w-4/5 sm:w-3/4 h-[80px] mt-14 mb-0.5  rounded-full flex items-center px-2 md:px-6 ${
                                              theme === "light"
                                                  ? "bg-light-background"
                                                  : theme === "dark"
                                                  ? "bg-dark-background"
                                                  : "bg-trueDark-background"
                                          }`}
                                      >
                                          <div className="cursor-pointer">
                                              <Image
                                                  className="object-cover w-14 h-14 rounded-full"
                                                  src={
                                                      currentConversationUser
                                                          .user.profileImage
                                                          ? currentConversationUser
                                                                .user
                                                                .profileImage
                                                          : AvatarIcon
                                                  }
                                                  alt={"AvatarIcon"}
                                                  width={50}
                                                  height={50}
                                              />
                                          </div>
                                          <div className="ml-2 mr-auto">
                                              <h3 className="text-lg">
                                                  {
                                                      currentConversationUser
                                                          ?.user?.firstName
                                                  }{" "}
                                                  {
                                                      currentConversationUser
                                                          ?.user?.lastName
                                                  }
                                              </h3>
                                              <p className="text-xs font-light text-gray-500">
                                                  {onlineFlag ? "Online" : ""}
                                              </p>
                                          </div>
                                          <div className="cursor-pointer">
                                              <FontAwesomeIcon
                                                  icon={faPhone}
                                                  style={{
                                                      color:
                                                          theme! == "light"
                                                              ? "#000"
                                                              : "#fff",
                                                  }}
                                                  size="xl"
                                              />
                                          </div>
                                      </div>
                                  )}

                            {/* message box. */}
                            {messages.length > 0 ? (
                                <div
                                    className="h-3/4 w-full overflow-y-auto scroll-smooth"
                                    ref={containerRef}
                                >
                                    <div className="p-2 sm:p-5 md:p-10">
                                        {messages.map(
                                            (
                                                {
                                                    message,
                                                    type,
                                                    timeStamp,
                                                    user: {
                                                        id,
                                                        firstName,
                                                        lastName,
                                                    },
                                                }: {
                                                    message: any;
                                                    type: any;
                                                    timeStamp: any;
                                                    user: {
                                                        id: any;
                                                        firstName: string;
                                                        lastName: string;
                                                    };
                                                },
                                                index: number
                                            ) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`max-w-[90%] sm:max-w-[60%] md:max-w-[40%] flex flex-col p-4 ${
                                                            id === adminUser?.id
                                                                ? "ml-auto items-end"
                                                                : "items-start"
                                                        }`}
                                                    >
                                                        {currentConversationUser.isGroup &&
                                                            id !==
                                                                adminUser?.id && (
                                                                <div
                                                                    className={`${
                                                                        theme ===
                                                                        "light"
                                                                            ? "text-gray-500"
                                                                            : "text-gray-200"
                                                                    }`}
                                                                    style={{
                                                                        fontSize:
                                                                            "1.0rem",
                                                                        lineHeight:
                                                                            "1.95rem",
                                                                    }}
                                                                >
                                                                    {firstName}{" "}
                                                                    {lastName}
                                                                </div>
                                                            )}
                                                        <div
                                                            className={`relative rounded-b-3xl p-4 group ${
                                                                id ===
                                                                adminUser?.id
                                                                    ? "bg-primary rounded-tl-3xl text-white"
                                                                    : `rounded-tr-3xl ${
                                                                          theme ===
                                                                          "light"
                                                                              ? "bg-light-background"
                                                                              : theme ===
                                                                                "dark"
                                                                              ? "bg-dark-background"
                                                                              : "bg-trueDark-background"
                                                                      }`
                                                            }`}
                                                        >
                                                            {type === "text" ? (
                                                                message
                                                            ) : (
                                                                <>
                                                                    <Image
                                                                        className="object-cover w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-lg hover:scale-105 transition-all"
                                                                        src={
                                                                            message
                                                                        }
                                                                        width={
                                                                            100
                                                                        }
                                                                        height={
                                                                            100
                                                                        }
                                                                        alt={
                                                                            "Image Message"
                                                                        }
                                                                    />
                                                                    <div className="absolute right-5 top-5 flex justify-center items-center">
                                                                        <FontAwesomeIcon
                                                                            className={`hidden h-6 w-6 cursor-pointer group-hover:block ${
                                                                                theme !==
                                                                                "light"
                                                                                    ? "group-hover:invert"
                                                                                    : ""
                                                                            }`}
                                                                            icon={
                                                                                faDownload
                                                                            }
                                                                            style={{
                                                                                color: "rgb(255 85 99)",
                                                                            }}
                                                                            onClick={() => {
                                                                                handleDownloadImage(
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={`${
                                                                theme ===
                                                                "light"
                                                                    ? "text-gray-500"
                                                                    : "text-gray-200"
                                                            }`}
                                                            style={{
                                                                fontSize:
                                                                    "0.60rem",
                                                                lineHeight:
                                                                    "1.25rem",
                                                            }}
                                                        >
                                                            {timeStamp}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-3/4 w-full flex flex-col justify-center">
                                    {currentConversationUser.isGroup ? (
                                        <div className="text-center text-lg font-semibold px-5">
                                            No Messages yet. say <b>Hi</b> and
                                            start conversation
                                        </div>
                                    ) : (
                                        <div className="text-center text-lg font-semibold px-5">
                                            No Messages yet. say <b>Hi</b> and
                                            start conversation with{" "}
                                            {
                                                currentConversationUser?.user
                                                    ?.firstName
                                            }
                                        </div>
                                    )}
                                    <div className="text-center text-3xl mt-5">
                                        {emoji}
                                    </div>
                                </div>
                            )}
                            {/* texting area. */}
                            {currentConversationUser.user.firstName && (
                                <div className="p-4 sm:p-6 md:p-8 w-full flex items-center">
                                    <Input
                                        placeholder="Type a message..."
                                        className="w-full"
                                        inputClassName="p-2 rounded-xl border-0 shadow-lg rounded-full bg-secondary text-gray-900 focus:ring-0 focus:border-0 outline-none"
                                        value={text}
                                        onChange={(e) =>
                                            setText(e.target.value)
                                        }
                                    />
                                    <div
                                        className={`ml-4 p-2 cursor-pointer ${
                                            !text && "pointer-events-none"
                                        }`}
                                        onClick={() => sendMessage()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTelegram}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="2x"
                                        />
                                    </div>
                                    <div className={`ml-4 p-2 cursor-pointer`}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            accept=".jpg, .jpeg, .png"
                                            onChange={handleImageInputChange}
                                        />
                                        <FontAwesomeIcon
                                            icon={faAdd}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="2x"
                                            onClick={handleEditClick}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="h-3/4 w-full flex flex-col justify-center">
                                <div className="text-center text-lg font-semibold px-5">
                                    No conversation started yet. Please choose
                                    user, say <b>Hi</b> and start conversation.
                                </div>
                                <div className="text-center text-3xl mt-5">
                                    {emoji}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* setting related content board. */}
            {dashboardType.setting && <Index />}
        </>
    );
};

export default ConversationsList;
