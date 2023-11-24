import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import lightTheme from "@/public/assets/themes/lightTheme.png";
import darkTheme from "@/public/assets/themes/darkTheme.png";
import trueDarkTheme from "@/public/assets/themes/trueDarkTheme.png";
import { dashboardContext, primaryContext } from "@/src/context";

const General = () => {
    const [themeMenuVisibility, setThemeMenuVisibility] =
        useState<boolean>(false);
    const { setNotificationData } = useContext(primaryContext);
    const { adminUser, setAdminUser, theme, toggleTheme } =
        useContext(dashboardContext);

    const toggleThemeMenuVisibility = () => {
        setThemeMenuVisibility((prevValue) => !prevValue);
    };
    /* update theme. */
    const updateTheme = async (themeValue: number) => {
        const inputData = {
            email: adminUser.email,
            theme: themeValue,
        };
        const res = await fetch("http://localhost:8000/api/userThemeUpdate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });
        const result = await res.json();
        if (res.status === 200) {
            setAdminUser((prevData: any) => ({
                ...prevData,
                theme: themeValue,
            }));
        }
        setNotificationData((prevData: any) => ({
            ...prevData,
            type: result.type,
            heading: result.heading,
            message: result.message,
            status: true,
        }));
    };

    return (
        <div
            className={`w-full max-h-[80%] mt-14 mb-0.5 rounded-lg overflow-y-auto shadow-lg ${
                theme === "light"
                    ? "bg-light-background text-light-text"
                    : theme === "dark"
                    ? "bg-dark-background text-dark-text"
                    : "bg-trueDark-background text-trueDark-text"
            }`}
        >
            <div className={`py-6 border-b border-b-gray-300`}>
                <div
                    className="cursor-pointer flex items-center"
                    onClick={toggleThemeMenuVisibility}
                >
                    <div className="ml-4">
                        <h3 className="text-lg">Set Theme</h3>
                    </div>
                    <div className="ml-auto px-5">
                        <FontAwesomeIcon
                            icon={faChevronUp}
                            rotation={themeMenuVisibility ? undefined : 180}
                            className="transition-all"
                            style={{
                                color: theme! == "light" ? "#000" : "#fff",
                            }}
                        />
                    </div>
                </div>
                <div className={`${themeMenuVisibility ? "block" : "hidden"}`}>
                    <hr />
                    <div className="flex flex-col md:flex-row justify-around items-center mx-2 my-5">
                        <div>
                            <div
                                className={`w-36 h-[7rem]  cursor-pointer ${
                                    theme === "light"
                                        ? "border-[10px] border-green-500 rounded-md shadow-xl opacity-100 scale-110"
                                        : "opacity-50"
                                }`}
                                onClick={() => updateTheme(1)}
                            >
                                <Image src={lightTheme} alt="light theme" />
                            </div>
                            <div className="text-sm font-thin my-4">
                                Light Theme
                            </div>
                        </div>
                        <div>
                            <div
                                className={`w-36 h-[7rem] cursor-pointer ${
                                    theme === "dark"
                                        ? "border-[10px] border-green-500 rounded-md shadow-xl opacity-100"
                                        : "opacity-60"
                                }`}
                                onClick={() => updateTheme(2)}
                            >
                                <Image src={darkTheme} alt="dark theme" />
                            </div>
                            <div className="text-sm font-thin my-4">
                                Dark Theme
                            </div>
                        </div>

                        <div>
                            <div
                                className={`w-36 h-[7rem] cursor-pointer ${
                                    theme === "trueDark"
                                        ? "border-[10px] border-green-500 rounded-md shadow-xl opacity-100"
                                        : "opacity-60"
                                }`}
                                onClick={() => updateTheme(3)}
                            >
                                <Image
                                    src={trueDarkTheme}
                                    alt="true dark theme"
                                />
                            </div>
                            <div className="text-sm font-thin my-4">
                                True Dark Theme
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default General;
