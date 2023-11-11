import Button from "@/src/components/button";
import Input from "@/src/components/input";
import edit from "@/public/assets/edit.svg";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { dashboardContext, primaryContext } from "@/src/context";

/* define type of status start. */
type formDatatype = {
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    status: string;
    profileImage: string;
};
/* define type of status end. */

const Profile = () => {
    /* context declaration start. */
    const { setNotificationData } = useContext(primaryContext);
    const { adminUser, setAdminUser } = useContext(dashboardContext);
    /* context declaration end. */

    /* ref hook variable declaration start. */
    const fileInputRef = useRef<any>(null);
    /* ref hook variable declaration end. */

    /* state variable declaration start. */
    const [formData, setFormData] = useState<formDatatype>({
        firstName: "",
        lastName: "",
        nickName: "",
        email: adminUser.email,
        status: "",
        profileImage: "",
    });
    /* state variable declaration end. */

    /* useEffect functions start. */
    useEffect(() => {
        getAdminUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* useEffect functions end. */

    /* get admin user details. */
    const getAdminUser = async () => {
        const res = await fetch(
            `http://localhost:8000/api/user/${adminUser.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (res.status === 200) {
            const result = await res.json();
            setFormData((prevData: any) => ({
                ...prevData,
                firstName: result.firstName,
                lastName: result.lastName,
                nickName: result.nickName,
                email: result.email,
                status: result.status,
                profileImage: result.profileImage,
            }));
        }
    };
    
    const handleEditClick = () => {
        fileInputRef.current.click(); // Trigger the file input
    };
    const handleFileInputChange = (event: any) => {
        const selectedFile = event.target.files[0]; // Get the selected file

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const img = document.createElement("img");
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxWidth = 300;
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedDataURL = canvas.toDataURL(
                        "image/jpeg",
                        0.6
                    );
                    setFormData((prevData: any) => ({
                        ...prevData,
                        profileImage: compressedDataURL,
                    }));
                };
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmitForm = async (e: any) => {
        e.preventDefault();
        // console.log("formData", formData);

        const res = await fetch("http://localhost:8000/api/userUpdate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (res.status === 200) {
            setAdminUser((prevData: any) => ({
                ...prevData,
                fistName: formData.firstName,
                lastName: formData.lastName,
                nickName: formData.nickName,
                profileImage: formData.profileImage,
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
        <>
            <form
                className="w-full max-h-[80%] bg-secondary mt-14 mb-0.5 rounded-lg overflow-y-auto shadow-lg"
                onSubmit={(e) => {
                    handleSubmitForm(e);
                }}
            >
                {/* image area. */}
                <div className="relative w-full h-96 flex justify-center group hover:scale-105">
                    {formData.profileImage ? (
                        <Image
                            className="object-cover w-96 h-96  hover:scale-105 transition-all rounded-full"
                            src={formData.profileImage}
                            width={200}
                            height={200}
                            alt={"Avatar Image"}
                        />
                    ) : (
                        <>
                            <p className="flex items-center text-2xl">
                                No Profile Image
                            </p>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                    />
                    <div className="absolute right-10 bottom-2 flex justify-center items-center">
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
