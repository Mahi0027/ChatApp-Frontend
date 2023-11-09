import Button from "@/src/components/button";
import Input from "@/src/components/input";
import user from "@/public/assets/user/profile.jpg"; /* It's is for temporary purpose. */
import edit from "@/public/assets/edit.svg";
import Image from "next/image";
import React, { useContext, useRef, useState } from "react";
import { primaryContext } from "@/src/context";
type formDatatype = {
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    status: string;
    profileImage: string;
};
const Profile = () => {
    const { setNotificationData } = useContext(primaryContext);
    const fileInputRef = useRef<any>(null);
    const [formData, setFormData] = useState<formDatatype>({
        firstName: "",
        lastName: "",
        nickName: "",
        email: "",
        status: "",
        profileImage: "",
    });
    const handleEditClick = () => {
        fileInputRef.current.click(); // Trigger the file input
    };
    const handleFileInputChange = (event: any) => {
        const selectedFile = event.target.files[0]; // Get the selected file

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData: any) => ({
                    ...prevData,
                    profileImage: reader.result as string,
                }));
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmitForm = async (e: any) => {
        e.preventDefault();
        const res = await fetch(
            `http://localhost:8000/api/userUpdate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(FormData),
            }
        );
        const result = await res.json();
        setNotificationData((prevData: any) => ({
            ...prevData,
            type: result.type,
            heading: result.heading,
            message: result.message,
            status: true,
        }));
        /* if (res.status === 200) {
            
        } else {
            setNotificationData((prevData: any) => ({
                ...prevData,
                type: result.type,
                heading: result.heading,
                message: result.message,
                status: true,
            }));
        } */
    };
    
    return (
        <>
            <form
                className="w-full max-h-[80%] bg-secondary mt-14 mb-0.5 rounded-lg overflow-y-auto shadow-lg"
                onSubmit={(e) => {
                    handleSubmitForm(e);
                }}
            >
                {/* image area. */}
                <div className="relative w-full h-96 flex justify-center group hover:scale-105">
                    <Image
                        className="object-cover hover:scale-110 transition-all"
                        src={user}
                        alt={"AvatarIcon"}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                    />
                    <div className="absolute right-5 bottom-2 flex justify-center items-center">
                        <Image
                            className="hidden h-8 w-8 font-bold text-5xl cursor-pointer z-100 group-hover:block"
                            src={edit}
                            alt="edit"
                            onClick={handleEditClick}
                        />
                    </div>
                </div>
                <hr className="my-5" />
                <div className="flex flex-col md:flex-row  mb-2">
                    <div className="w-full flex justify-center">
                        <Input
                            label="First name"
                            name="firstName"
                            placeholder="Enter your first name"
                            isRequired={true}
                            value={formData.firstName}
                            onChange={(e: any) => {
                                setFormData((prevData: any) => ({
                                    ...prevData,
                                    firstName: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="w-full flex justify-center">
                        <Input
                            label="Last name"
                            name="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={(e: any) => {
                                setFormData((prevData: any) => ({
                                    ...prevData,
                                    lastName: e.target.value,
                                }));
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row  mb-2">
                    <div className="w-full flex justify-center">
                        <Input
                            label="Nick name"
                            name="nickName"
                            placeholder="Enter your nick name"
                            isRequired={true}
                            value={formData.nickName}
                            onChange={(e: any) => {
                                setFormData((prevData: any) => ({
                                    ...prevData,
                                    nickName: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="w-full flex justify-center">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            isRequired={true}
                            disabled={true}
                            value={formData.email}
                            onChange={(e: any) => {
                                setFormData((prevData: any) => ({
                                    ...prevData,
                                    email: e.target.value,
                                }));
                            }}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <Input
                        label="Status"
                        name="status"
                        placeholder="What is current status"
                        isRequired={true}
                        isTextArea={true}
                        value={formData.status}
                        onChange={(e: any) => {
                            setFormData((prevData: any) => ({
                                ...prevData,
                                status: e.target.value,
                            }));
                        }}
                    />
                </div>
                <hr className="my-5" />
                <div className="flex flex-col md:flex-row mb-5">
                    <div className="w-full flex justify-center my-2 md:my-0">
                        <Button
                            label="Reset"
                            type="button"
                            className="w-full mx-2 text-black bg-gray-200 hover:text-white hover:bg-gray-400"
                        />
                    </div>
                    <div className="w-full flex justify-center my-2 md:my-0">
                        <Button
                            label="Submit"
                            type="submit"
                            className="w-full mx-2 text-black bg-green-300 hover:text-white hover:bg-green-400"
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default Profile;
