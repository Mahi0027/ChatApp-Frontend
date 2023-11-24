import Button from "@/src/components/button";
import { dashboardContext } from "@/src/context";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const Logout = () => {
    const { theme } = useContext(dashboardContext);
    const router = useRouter();

    const logOutActionHandle = () => {
        localStorage.removeItem("user:token");
        localStorage.removeItem("user:detail");
        window.location.reload();
    };
    return (
        <div className="flex flex-col md:flex-row mb-5">
            <div className="w-full flex justify-center my-2 md:my-0">
                <Button
                    label="Log Out"
                    type="button"
                    className={`w-full mx-2 px-24 py-4 bg-red-400 hover:bg-red-500 text-white text-xl`}
                    onClick={logOutActionHandle}
                />
            </div>
        </div>
    );
};

export default Logout;
