import ProtectedRoute from "@/src/components/ProtectedRoute";
import Form from "@/src/modules/form";
import React from "react";

const sign_in = () => {
    return (
        <ProtectedRoute>
            <div className="bg-[#e1e7f2] h-screen flex justify-center items-center">
                <Form isSignInPage={true} />
            </div>
        </ProtectedRoute>
    );
};

export default sign_in;
