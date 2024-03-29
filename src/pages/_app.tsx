import React, { useEffect, useState } from "react";
import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { primaryContext } from "@/src/context";
import Notification from "../components/notification";

type notificationDataType = {
    type: string;
    heading: string;
    message: string;
    status: boolean;
};
export default function App({ Component, pageProps }: AppProps) {
    const [notificationData, setNotificationData] =
        useState<notificationDataType>({
            type: "",
            heading: "",
            message: "",
            status: false,
        });

    const [activeUsers, setActiveUsers] = useState<any>([]);
    
    return (
        <primaryContext.Provider
            value={{
                notificationData,
                setNotificationData,
                activeUsers,
                setActiveUsers,
            }}
        >
            <Notification
                type={notificationData.type}
                heading={notificationData.heading}
                message={notificationData.message}
                show={notificationData.status}
            />
            <Component {...pageProps} />
        </primaryContext.Provider>
    );
}
