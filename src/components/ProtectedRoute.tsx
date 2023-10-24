import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

const ProtectedRoute = ({
    children,
    auth = false,
}: {
    children: any;
    auth?: Boolean;
}) => {
    const router = useRouter();

    const isAuthenticated = useCallback(() => {
        const isLoggedIn =
            typeof window !== "undefined" &&
            localStorage.getItem("user:token") !== null;

        console.log("isLoggedIn>> ", isLoggedIn);
        if (isLoggedIn && auth) return true;
        return false;
    }, []);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/users/sign_in"); // Redirect to the login page if not authenticated
        } else if (
            isAuthenticated() &&
            ["/users/sign_in", "/users/sign_up"].includes(
                window.location.pathname
            )
        ) {
            router.push("/");
        }
    }, []);

    return children;
};

export default ProtectedRoute;
