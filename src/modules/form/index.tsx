import Button from "@/src/components/button";
import Input from "@/src/components/input";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { primaryContext } from "@/src/context";

function Form({ isSignInPage = true }) {
    const { setNotificationData } = useContext(primaryContext);
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: "",
        }),
        email: "",
        password: "",
    });
    const router = useRouter();

    /* on submit form for signIn/signUp */
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
        const result = await res.json();
        if (res.status === 200) {
            if (result.token) {
                localStorage.setItem("user:token", result.token);
                localStorage.setItem(
                    "user:detail",
                    JSON.stringify(result.user)
                );
                router.push("/");
            }
        } else {
            setNotificationData((prevData: any) => ({
                ...prevData,
                type: result.type,
                heading: result.heading,
                message: result.message,
                status: true,
            }));
        }
    };

    return (
        <>
            <div className="bg-white w-5/6 sm:w-2/3 md:1/2 lg:w-[720px] h-2/3 shadow-lg rounded-lg flex flex-col justify-center items-center overflow-auto">
                {/* title section start */}
                <div className="flex flex-col justify-center items-center px-6">
                    <div className="text-3xl sm:text-4xl font-bold">
                        Welcome {isSignInPage && "Back"}
                    </div>
                    <div className="text-lg font-light mb-10">
                        {isSignInPage
                            ? "Sign in to get explored"
                            : "Sign up to get started"}
                    </div>
                </div>
                {/* title section end */}
                {/* form section start */}
                <form
                    className="flex flex-col justify-center items-center w-full"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    {!isSignInPage && (
                        <Input
                            label="Full name"
                            name="name"
                            placeholder="Enter your full name"
                            isRequired={true}
                            className="mb-6 sm:w-2/3 md:w-1/2"
                            value={data.fullName}
                            onChange={(e: any) =>
                                setData({
                                    ...data,
                                    fullName: e.target.value,
                                })
                            }
                        />
                    )}
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        isRequired={true}
                        className="mb-6 sm:w-2/3 md:w-1/2"
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
                        className="mb-10 sm:w-2/3 md:w-1/2"
                        value={data.password}
                        onChange={(e: any) =>
                            setData({ ...data, password: e.target.value })
                        }
                    />
                    <Button
                        label={isSignInPage ? "Sign in" : "Sign up"}
                        type="submit"
                        className="w-5/6 sm:w-2/3 md:w-1/2 mb-2"
                    />
                </form>
                {/* form section end */}
                {/* footer section start */}
                <div className=" px-6">
                    {isSignInPage
                        ? "Didn't have an account? "
                        : "Already have an account? "}
                    <span className="text-primary cursor-pointer underline">
                        {isSignInPage ? (
                            <Link href="sign_up">Sign up</Link>
                        ) : (
                            <Link href="sign_in">Sign in</Link>
                        )}
                    </span>
                </div>
                {/*  footer section end */}
            </div>
        </>
    );
}

export default Form;
