import Dashboard from "@/src/modules/dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useState } from "react";
import { dashboardContext } from "@/src/context";

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
};
/* define type of status end. */

export default function Home() {
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
        status:"",
    }); /* admin user */
    /* state variable declaration end. */
    return (
        <>
            <ProtectedRoute auth={true}>
                <div className="bg-[#e1e7f2] h-screen flex justify-center items-center">
                    <dashboardContext.Provider
                        value={{
                            dashboardType,
                            setDashboardType,
                            settingPage,
                            setSettingPage,
                            adminUser,
                            setAdminUser,
                        }}
                    >
                        <Dashboard />
                    </dashboardContext.Provider>
                </div>
            </ProtectedRoute>
        </>
    );
}
