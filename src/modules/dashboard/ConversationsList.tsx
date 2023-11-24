import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import Input from "@/src/components/input";
import Button from "@/src/components/button";
import emojis from "@/public/assets/emojis.json";
import { dashboardContext, primaryContext } from "@/src/context";
import Index from "./settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

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
};
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
}: ConversationListType) => {
    const { activeUsers } = useContext(primaryContext);
    const { dashboardType, settingPage, adminUser, setAdminUser, theme } =
        useContext(dashboardContext);
    const [text, setText] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("");
    const [showBackOption, setShowBackOption] = useState<boolean>(true);
    const [onlineFlag, setOnlineFlag] = useState<boolean>(false);
    const containerRef = useRef<any>(null);

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
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    /* send message */
    const sendMessage = async () => {
        const inputData = {
            conversationId: currentConversationUser?.conversationId,
            senderId: adminUser?.id,
            message: text,
            receiverId: currentConversationUser?.user?.id,
        };

        setMessages((prevData: any) => [
            ...prevData,
            {
                user: {
                    id: adminUser.id,
                    email: adminUser.email,
                    fullName: adminUser.fullName,
                },
                message: text,
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
                (homePageForUserListFlag ? (
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
                            {currentConversationUser.user.firstName && (
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
                                                currentConversationUser.user
                                                    .profileImage
                                                    ? currentConversationUser
                                                          .user.profileImage
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
                                                currentConversationUser?.user
                                                    ?.firstName
                                            }{" "}
                                            {
                                                currentConversationUser?.user
                                                    ?.lastName
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
                                                    user: { id },
                                                }: {
                                                    message: any;
                                                    user: { id: any };
                                                },
                                                index: number
                                            ) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`max-w-[90%] sm:max-w-[60%] md:max-w-[40%] flex flex-col p-4 mb-6 ${
                                                            id === adminUser?.id
                                                                ? "ml-auto items-end"
                                                                : "items-start"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`rounded-b-3xl p-4 ${
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
                                                            {message}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-3/4 w-full flex flex-col justify-center">
                                    <div className="text-center text-lg font-semibold px-5">
                                        No Messages yet. say <b>Hi</b> and start
                                        conversation with{" "}
                                        {
                                            currentConversationUser?.user
                                                ?.firstName
                                        }
                                    </div>
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
                                    <div
                                        className={`ml-4 p-2 cursor-pointer ${
                                            !text && "pointer-events-none"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAdd}
                                            style={{
                                                color:
                                                    theme! == "light"
                                                        ? "#000"
                                                        : "#fff",
                                            }}
                                            size="2x"
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
