import Dashboard from "@/src/modules/dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { dashboardContext } from "@/src/context";
import screenfull from "screenfull";
import Button from "../components/button";

/* define type of status start. */
type dashboardTypeType = {
    chat: boolean;
    user: boolean;
    setting: boolean;
};

type settingPageType = {
    profile: boolean;
    general: boolean;
    chats: boolean;
    help: boolean;
    logout: boolean;
};

type adminUserType = {
    id: string;
    email: string;
    fistName: string;
    lastName: string;
    nickName: string;
    profileImage: string;
    status: string;
    theme: number;
};

export type ListOfAllUserType = {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImage: string;
    };
}[];
/* define type of status end. */

export default function Home() {
    const [showFullScreenButton, setShowFullScreenButton] = useState(false);
    /* state variable declaration start. */
    const [dashboardType, setDashboardType] = useState<dashboardTypeType>({
        chat: true,
        user: false,
        setting: false,
    });
    const [settingPage, setSettingPage] = useState<settingPageType>({
        profile: true,
        general: false,
        chats: false,
        help: false,
        logout: false,
    });
    const [adminUser, setAdminUser] = useState<adminUserType>({
        id: "",
        email: "",
        fistName: "",
        lastName: "",
        nickName: "",
        profileImage: "",
        status: "",
        theme: 0,
    }); /* admin user */

    /* state variable declaration start. */
    const [listOfAllUsers, setListOfAllUsers] = useState<ListOfAllUserType>([
        {
            user: {
                id: "",
                email: "",
                firstName: "",
                lastName: "",
                profileImage: "",
            },
        },
    ]); /* list of all users */
    const [theme, setTheme] = useState<string>("light");
    /* state variable declaration end. */

    useEffect(() => {
        if (window.innerWidth < 640) {
            setShowFullScreenButton(true);
        } else {
            setShowFullScreenButton(false);
        }
    }, [])
    
    useEffect(() => {
        if (adminUser.theme) {
            toggleTheme(adminUser.theme);
        }
    }, [adminUser.theme]);

    const toggleTheme = (newTheme: number) => {
        setTheme((prevTheme) => {
            switch (newTheme) {
                case 1:
                    return "light";
                case 2:
                    return "dark";
                case 3:
                    return "trueDark";
                default:
                    return "light";
            }
        });
    };

    function fullScreen(): void {
        setShowFullScreenButton(false);
        if (screenfull.isEnabled) {
            const elem: any = document.documentElement; // You can use document.documentElement to request fullscreen for the entire document.
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                /* IE11 */
                elem.msRequestFullscreen();
            }
        }
    }
    return (
        <>
            <ProtectedRoute auth={true}>
                <div className="h-screen flex justify-center items-center">
                    <dashboardContext.Provider
                        value={{
                            dashboardType,
                            setDashboardType,
                            settingPage,
                            setSettingPage,
                            adminUser,
                            setAdminUser,
                            listOfAllUsers,
                            setListOfAllUsers,
                            theme,
                            toggleTheme,
                        }}
                    >
                        {showFullScreenButton && <Button
                            label="Full Screen"
                            type="button"
                            className="w-5/6 sm:w-2/3 md:w-1/2 mb-2 h-20 text-white text-2xl bg-primary hover:bg-primary"
                            onClick={fullScreen}
                        />}
                        {!showFullScreenButton && <Dashboard />}
                    </dashboardContext.Provider>
                </div>
            </ProtectedRoute>
        </>
    );
}
