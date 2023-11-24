import React from "react";

const Button = ({
    label = "Button",
    type = "button",
    className = "",
    disabled = false,
    onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        return;
    },
}: {
    label?: String;
    type?: "button" | "submit" | "reset" | undefined;
    className?: String;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
    return (
        <button
            type={type}
            className={`focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;
