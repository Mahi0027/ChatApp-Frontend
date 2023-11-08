import Dashboard from "@/src/modules/dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useState } from "react";
import { dashboardContext } from "@/src/context";

export default function Home() {
    const [dashboardType, setDashboardType] = useState({
        chat: true,
        user: false,
        setting: false,
    });
    const [settingPage, setSettingPage] = useState({
        profile: true,
        general: false,
        chats: false,
        help: false,
        logout: false,
    });
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
                        }}
                    >
                        <Dashboard />
                    </dashboardContext.Provider>
                </div>
            </ProtectedRoute>
        </>
    );
}
