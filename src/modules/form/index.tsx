import Button from "@/src/components/button";
import Input from "@/src/components/input";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function Form({ isSignInPage = true }) {
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: "",
        }),
        email: "",
        password: "",
    });
    const router = useRouter();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await fetch(
            `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        if (res.status === 200) {
            const result = await res.json();
            if (result.token) {
                localStorage.setItem("user:token", result.token);
                localStorage.setItem(
                    "user:detail",
                    JSON.stringify(result.user)
                );
                router.push("/");
            }
        } else {
            console.log("invalid credentials");
        }
    };
    return (
        <div className="bg-white w-2/3 h-2/3 shadow-lg rounded-lg flex flex-col justify-center items-center">
            <div className="text-4xl font-extrabold">
                Welcome {isSignInPage && "Back"}
            </div>
            <div className="text-xl font-light mb-10">
                {isSignInPage
                    ? "Sign in to get explored"
                    : "Sign up to get started"}
            </div>
            <form
                className="flex flex-col items-center w-full"
                onSubmit={(e) => handleSubmit(e)}
            >
                {!isSignInPage && (
                    <Input
                        label="Full name"
                        name="name"
                        placeholder="Enter your full name"
                        isRequired={true}
                        className="mb-6"
                        value={data.fullName}
                        onChange={(e: any) =>
                            setData({ ...data, fullName: e.target.value })
                        }
                    />
                )}
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    isRequired={true}
                    className="mb-6"
                    value={data.email}
                    onChange={(e: any) =>
                        setData({ ...data, email: e.target.value })
                    }
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    isRequired={true}
                    className="mb-10"
                    value={data.password}
                    onChange={(e: any) =>
                        setData({ ...data, password: e.target.value })
                    }
                />
                <Button
                    label={isSignInPage ? "Sign in" : "Sign up"}
                    type="submit"
                    className="w-1/2 mb-2"
                />
            </form>
            <div>
                {isSignInPage
                    ? "Didn't have an account?"
                    : "Already have an account?"}
                <span className="text-primary cursor-pointer underline">
                    {isSignInPage ? (
                        <Link href="sign_up">Sign up</Link>
                    ) : (
                        <Link href="sign_in">Sign in</Link>
                    )}
                </span>
            </div>
        </div>
    );
}

export default Form;
