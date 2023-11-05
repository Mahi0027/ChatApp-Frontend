import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import PhoneIcon from "@/public/assets/phone.svg";
import Input from "@/src/components/input";
import SendIcon from "@/public/assets/send.svg";
import CirclePlusIcon from "@/public/assets/circlePlus.svg";
import Button from "@/src/components/button";
import emojis from "@/public/assets/emojis.json";
import context from "@/src/context";

type ConversationListType = {
    adminUser: any;
    socket: any;
    showUsersFlag: boolean;
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
    adminUser,
    socket,
    showUsersFlag,
    currentConversationUser,
    messages,
    setMessages,
    newUserDetails,
    homePageForUserListFlag,
    homePageForConversationListFlag,
    startConversation,
    backToMenuOption,
}: ConversationListType) => {
    const { activeUsers } = useContext(context);
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
        console.log("activeUsers", activeUsers);

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
            {showUsersFlag ? (
                homePageForUserListFlag ? (
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
                                    src={AvatarIcon}
                                    width={400}
                                    height={400}
                                    alt={"AvatarIcon"}
                                />
                            </div>
                            <div className="text-lg font-semibold">
                                {newUserDetails?.user.fullName}
                            </div>
                            <div className="text-md">
                                {newUserDetails?.user.email}
                            </div>
                        </div>
                        <div className="text-center mt-20">
                            <Button
                                label={`Start Conversation with ${newUserDetails?.user.fullName}`}
                                type="button"
                                className="w-full mb-2 transform transition-transform hover:scale-105"
                                onClick={() =>
                                    startConversation(newUserDetails?.userId)
                                }
                            />
                        </div>
                    </div>
                )
            ) : (
                <>
                    {!homePageForConversationListFlag ? (
                        <>
                            {/* current chat user name and status. */}
                            {currentConversationUser?.user?.fullName && (
                                <div className="w-4/5 sm:w-3/4 bg-secondary h-[80px] mt-14 mb-0.5 rounded-full flex items-center px-4 md:px-6">
                                    <div className="cursor-pointer">
                                        <Image
                                            src={AvatarIcon}
                                            alt={"AvatarIcon"}
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="ml-2 mr-auto">
                                        <h3 className="text-lg">
                                            {
                                                currentConversationUser?.user
                                                    ?.fullName
                                            }
                                        </h3>
                                        <p className="text-xs font-light text-gray-500">
                                            {onlineFlag ? "Online" : ""}
                                        </p>
                                    </div>
                                    <div className="cursor-pointer">
                                        <Image
                                            src={PhoneIcon}
                                            width={30}
                                            height={30}
                                            alt={"phoneIcon"}
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
                                                                    : "bg-secondary rounded-tr-3xl"
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
                                                ?.fullName
                                        }
                                    </div>
                                    <div className="text-center text-3xl mt-5">
                                        {emoji}
                                    </div>
                                </div>
                            )}
                            {/* texting area. */}
                            {currentConversationUser?.user?.fullName && (
                                <div className="p-4 sm:p-6 md:p-8 w-full flex items-center">
                                    <Input
                                        placeholder="Type a message..."
                                        className="w-full"
                                        inputClassName="p-2 rounded-xl border-0 shadow-lg rounded-full bg-secondary focus:ring-0 focus:border-0 outline-none"
                                        value={text}
                                        onChange={(e) =>
                                            setText(e.target.value)
                                        }
                                    />
                                    <div
                                        className={`ml-4 p-2 cursor-pointer bg-secondary rounded-full ${
                                            !text && "pointer-events-none"
                                        }`}
                                        onClick={() => sendMessage()}
                                    >
                                        <Image
                                            src={SendIcon}
                                            width={30}
                                            height={30}
                                            alt={"SendIcon"}
                                        />
                                    </div>
                                    <div
                                        className={`ml-4 p-2 cursor-pointer bg-secondary rounded-full ${
                                            !text && "pointer-events-none"
                                        }`}
                                    >
                                        <Image
                                            src={CirclePlusIcon}
                                            width={30}
                                            height={30}
                                            alt={"CirclePlusIcon"}
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
        </>
    );
};

export default ConversationsList;
