import React, { useEffect, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import PhoneIcon from "@/public/assets/phone.svg";
import Input from "@/src/components/input";
import SendIcon from "@/public/assets/send.svg";
import CirclePlusIcon from "@/public/assets/circlePlus.svg";
import Button from "@/src/components/button";
import emojis from "@/public/assets/emojis.json";

const ConversationsList = ({
    adminUser,
    showUsersFlag,
    currentConversationUser,
    messages,
    newUserDetails,
    homePageForUserListFlag,
    startConversation,
}) => {
    const [text, setText] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("");
    useEffect(() => {
        setEmoji(emojis[Math.floor(Math.random() * 320)]);
    }, []);
    /* send message */
    const sendMessage = async () => {
        const inputData = {
            conversationId: currentConversationUser?.conversationId,
            senderId: adminUser?.id,
            message: text,
            receiverId: "",
        };
        setText("");
        console.log("sending data", inputData);
        const res = await fetch("http://localhost:8000/api/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });
        if (res.status === 200) {
            const result = await res.json();
            console.log("sending response: ", result);
        } else {
            console.log("invalid inputs");
        }
    };
    return (
        <>
            {showUsersFlag ? (
                homePageForUserListFlag ? (
                    <div className="h-3/4 w-full flex flex-col justify-center">
                        <div className="text-center text-lg font-semibold">
                            No conversation selected yet. Please choose user and
                            start conversation.
                        </div>
                        <div className="text-center text-3xl mt-5">{emoji}</div>
                    </div>
                ) : (
                    <div className="h-3/4 w-full flex flex-col justify-center">
                        <div className="text-center">
                            <div className="flex flex-col items-center m-10">
                                <Image
                                    src={AvatarIcon}
                                    width={150}
                                    height={150}
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
                                className="w-1/2 mb-2 transform transition-transform hover:scale-105"
                                onClick={() =>
                                    startConversation(newUserDetails?.userId)
                                }
                            />
                        </div>
                    </div>
                )
            ) : (
                <>
                    {/* current chat user name and status. */}
                    {currentConversationUser?.user?.fullName && (
                        <div className="w-3/4 bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 ">
                            <div className="cursor-pointer">
                                <Image
                                    src={AvatarIcon}
                                    alt={"AvatarIcon"}
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="ml-6 mr-auto">
                                <h3 className="text-lg">
                                    {currentConversationUser?.user?.fullName}
                                </h3>
                                <p className="text-xs font-light text-gray-500">
                                    Active
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
                        <div className="h-3/4 w-full overflow-y-auto scroll-smooth">
                            <div className="p-10">
                                {messages.map(
                                    ({ message, user: { id } }, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`max-w-[40%] rounded-b-3xl p-4  mb-6 ${
                                                    id === adminUser?.id
                                                        ? "bg-primary rounded-tl-3xl ml-auto text-white"
                                                        : "bg-secondary rounded-tr-3xl"
                                                }`}
                                            >
                                                {message}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-3/4 w-full flex flex-col justify-center">
                            <div className="text-center text-lg font-semibold">
                                No Messages yet. say <b>Hi</b> and start
                                conversation with{" "}
                                {currentConversationUser?.user?.fullName}
                            </div>
                            <div className="text-center text-3xl mt-5">
                                {emoji}
                            </div>
                        </div>
                    )}
                    {/* texting area. */}
                    {currentConversationUser?.user?.fullName && (
                        <div className="p-14 w-full flex items-center">
                            <Input
                                placeholder="Type a message..."
                                className="w-full"
                                inputClassName="p-2 px-4 rounded-xl border-0 shadow-lg rounded-full bg-secondary focus:ring-0 focus:border-0 outline-none"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
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
            )}
        </>
    );
};

export default ConversationsList;
