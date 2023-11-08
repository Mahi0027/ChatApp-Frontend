import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import Success from "@/public/assets/notifications/success.svg";
import Info from "@/public/assets/notifications/info.svg";
import Warning from "@/public/assets/notifications/warning.svg";
import Error from "@/public/assets/notifications/error.svg";
import Close from "@/public/assets/notifications/close.svg";
import Image from "next/image";
import { primaryContext } from "@/src/context";

const Notification = ({
    type = "info",
    heading = "",
    message = "",
    show = false,
}) => {
    const { setNotificationData } = useContext(primaryContext);

    const [showFlag, setShowFlag] = useState<boolean>(show);
    const [icon, setIcon] = useState<any>(null);
    const [color, setColor] = useState<string>("");

    useEffect(() => {
        setShowFlag(show);
        if (type === "success") {
            setIcon(Success);
        } else if (type === "warning") {
            setIcon(Warning);
            setColor("yellow");
        } else if (type === "error") {
            setIcon(Error);
            setColor("red");
        } else {
            setIcon(Info);
            setColor("blue");
        }
        const timeout = setTimeout(() => {
            setNotificationData((prevData: any) => ({
                ...prevData,
                status: false,
            }));
            setShowFlag(false);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [setNotificationData, show, type]);

    /* close notification manually. */
    const closeNotification = useCallback(() => {
        setNotificationData((prevData: any) => ({
            ...prevData,
            status: false,
        }));
        setShowFlag(false);
    }, [setNotificationData, setShowFlag]);

    const component = useMemo(() => {
        return (
            <div
                className={` ${
                    !showFlag ? "hidden" : ""
                } fixed top-5 right-[10%] sm:right-[5%] md:right-10  w-[80%] sm:w-2/3 md:w-[500px]`}
            >
                <div
                    className={`px-6 py-2 bg-white rounded-lg shadow-xl border border-${color}-600 border-opacity-30 w-full flex justify-between `}
                >
                    <div className="flex justify-start items-center">
                        <div>
                            {icon && (
                                <Image
                                    className="w-12 h-12 pr-1"
                                    src={icon}
                                    alt="icon"
                                />
                            )}
                        </div>
                        <div className="pl-2">
                            <div className="text-gray-800 font-semibold font-mono">
                                {heading}
                            </div>
                            <div className="text-gray-500 font-light">
                                {message}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Image
                            className="w-8 h-8 pl-2 cursor-pointer"
                            src={Close}
                            alt="icon"
                            onClick={closeNotification}
                        />
                    </div>
                </div>
            </div>
        );
    }, [closeNotification, color, heading, icon, message, showFlag]);

    return component;
};

export default Notification;
