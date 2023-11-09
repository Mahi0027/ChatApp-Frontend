import React from "react";

const Input = ({
    label = "",
    name = "",
    type = "text",
    className = "",
    inputClassName = "",
    isRequired = false,
    placeholder = "",
    isTextArea = false,
    value = "",
    disabled = false,
    onChange = (e: any) => {
        return;
    },
}) => {
    return (
        <div className={`w-5/6 ${className}`}>
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-gray-500"
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                    isTextArea ? "resize-y" : ""
                } dark:placeholder-gray-400 dark:focus:ring-blue-50 dark:focus:border-blue-500 ${disabled? "bg-gray-300 border-gray-500":""} ${inputClassName}`}
                placeholder={placeholder}
                required={isRequired}
                value={value}
                onChange={onChange}
                style={isTextArea ? { height: "auto" } : {}}
                disabled={disabled}
            />
        </div>
    );
};

export default Input;
