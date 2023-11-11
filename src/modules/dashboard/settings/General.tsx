import React, { useState } from "react";
const General = () => {
    const [themeMenuVisibility, setThemeMenuVisibility] =
        useState<boolean>(false);
    const toggleThemeMenuVisibility = () => {
        console.log(themeMenuVisibility);

        setThemeMenuVisibility((prevValue) => !prevValue);
    };
    return (
        <div className="w-full max-h-[80%] bg-secondary mt-14 mb-0.5 rounded-lg overflow-y-auto shadow-lg">
            <div className={`py-6 border-b border-b-gray-300`}>
                <div>
                    <div
                        className="cursor-pointer flex items-center"
                        onClick={toggleThemeMenuVisibility}
                    >
                        <div className="ml-4">
                            <h3 className="text-lg">Set Theme</h3>
                        </div>
                        <div className="ml-auto px-5">
                            {themeMenuVisibility ? "˄" : "˅"}
                        </div>
                    </div>
                    <div
                        className={`${
                            themeMenuVisibility ? "block" : "hidden"
                        }`}
                    >
                        Hello Mahi
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
};

export default General;
