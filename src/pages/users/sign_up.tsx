import ProtectedRoute from "@/src/components/ProtectedRoute";
import Form from "@/src/modules/form";
import React from "react";

const sign_up = () => {
    return (
        <div className="bg-[#e1e7f2] h-screen flex justify-center items-center">
            <Form isSignInPage={false} />
        </div>
    );
};

export default sign_up;
