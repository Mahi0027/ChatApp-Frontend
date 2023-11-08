import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import PhoneIcon from "@/public/assets/phone.svg";
import Input from "@/src/components/input";
import SendIcon from "@/public/assets/send.svg";
import CirclePlusIcon from "@/public/assets/circlePlus.svg";
import Button from "@/src/components/button";
import emojis from "@/public/assets/emojis.json";
import user from "@/public/assets/user/profile.jpg"; /* It's is for temporary purpose. */
import edit from "@/public/assets/edit.svg";
import { dashboardContext, primaryContext } from "@/src/context";

type ConversationListType = {
    adminUser: any;
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
    adminUser,
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
    const { dashboardType, settingPage } = useContext(dashboardContext);
    const [text, setText] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("");
    const [showBackOption, setShowBackOption] = useState<boolean>(true);
    const [onlineFlag, setOnlineFlag] = useState<boolean>(false);
    const containerRef = useRef<any>(null);
    const fileInputRef = useRef<any>(null);

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

    const handleEditClick = () => {
        fileInputRef.current.click(); // Trigger the file input
    };
    const handleFileInputChange = (event: any) => {
        const selectedFile = event.target.files[0]; // Get the selected file
        // Process the selected file as needed
        console.log("selectedFile,selectedFile");
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
                ))}

            {/* conversation related content board. */}
            {dashboardType.chat && (
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

            {/* setting related content board. */}
            {dashboardType.setting && (
                <div className="h-full w-full md:w-4/5 lg:w-3/5 flex flex-col justify-center items-center text-center text-lg font-semibold px-5">
                    {settingPage.profile && (
                        <>
                            <form className="w-full max-h-[80%] bg-secondary mt-14 mb-0.5 rounded-lg overflow-y-auto shadow-lg">
                                <div className="relative w-full h-96 flex justify-center group hover:opacity-50 transition-opacity delay-100">
                                    <Image
                                        className="object-cover hover:scale-110 transition-all"
                                        src={user}
                                        alt={"AvatarIcon"}
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileInputChange}
                                    />
                                    <div className="absolute top-[48%] left-[48%] flex justify-center items-center">

                                    <Image
                                        className="hidden h-8 w-8 font-bold text-5xl cursor-pointer z-100 hover:opacity-100 group-hover:scale-125 group-hover:block opacity-100 transition-all"
                                        src={edit}
                                        alt="edit"
                                        onClick={handleEditClick}
                                    />
                                    </div>
                                </div>
                                <hr className="my-5" />
                                <div className="flex flex-col md:flex-row  mb-2">
                                    <div className="w-full flex justify-center">
                                        <Input
                                            label="First name"
                                            name="firstName"
                                            placeholder="Enter your first name"
                                            isRequired={true}
                                            value=""
                                            onChange={(e: any) => {}}
                                        />
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <Input
                                            label="Last name"
                                            name="lastName"
                                            placeholder="Enter your last name"
                                            isRequired={true}
                                            value=""
                                            onChange={(e: any) => {}}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row  mb-2">
                                    <div className="w-full flex justify-center">
                                        <Input
                                            label="Nick name"
                                            name="nickName"
                                            placeholder="Enter your nick name"
                                            isRequired={true}
                                            value=""
                                            onChange={(e: any) => {}}
                                        />
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <Input
                                            label="Email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            isRequired={true}
                                            value=""
                                            onChange={(e: any) => {}}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex justify-center">
                                    <Input
                                        label="Status"
                                        name="status"
                                        placeholder="What is current status"
                                        isRequired={true}
                                        isTextArea={true}
                                        value=""
                                        onChange={(e: any) => {
                                            setText(e.target.value);
                                        }}
                                    />
                                </div>
                                <hr className="my-5" />
                                <div className="flex flex-col md:flex-row mb-5">
                                    <div className="w-full flex justify-center my-2 md:my-0">
                                        <Button
                                            label="Reset"
                                            type="button"
                                            className="w-full mx-2 text-black bg-gray-200 hover:text-white hover:bg-gray-400"
                                        />
                                    </div>
                                    <div className="w-full flex justify-center my-2 md:my-0">
                                        <Button
                                            label="Reset"
                                            type="submit"
                                            className="w-full mx-2 text-black bg-green-400 hover:text-white hover:bg-green-400"
                                        />
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                    {settingPage.general && (
                        <>
                            <p>This is general setting page</p>
                        </>
                    )}
                    {settingPage.chats && (
                        <>
                            <p>This is chats setting page</p>
                        </>
                    )}
                    {settingPage.help && (
                        <>
                            <p>This is help setting page</p>
                        </>
                    )}
                    {settingPage.logout && (
                        <>
                            <p>This is logout setting page</p>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationsList;
