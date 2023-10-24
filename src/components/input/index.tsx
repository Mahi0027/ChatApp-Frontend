import React from "react";

const Input = ({
    label = "",
    name = "",
    type = "text",
    className = "",
    inputClassName="",
    isRequired = false,
    placeholder = "",
    value = "",
    onChange = (e: any) => {
        return;
    },
}) => {
    return (
        <div className={`w-1/2 ${className}`}>
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-gray-500"
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400dark:focus:ring-blue-50 dark:focus:border-blue-500 ${inputClassName}`}
                placeholder={placeholder}
                required={isRequired}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;