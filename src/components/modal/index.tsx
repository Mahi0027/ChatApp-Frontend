import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AvatarIcon from "@/public/assets/avatar.svg";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

type ModalType = {
    showProfileFlag: boolean;
    theme: string;
    setShowProfileFlag: (arg0: any) => void;
    detailsForModal: any;
};

export default function Modal({
    showProfileFlag = false,
    theme = "light",
    setShowProfileFlag,
    detailsForModal,
}: ModalType) {
    const [open, setOpen] = useState(showProfileFlag);

    useEffect(() => {
        setOpen(showProfileFlag);
    }, [detailsForModal, showProfileFlag]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                // initialFocus={cancelButtonRef}
                onClose={setShowProfileFlag}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-1/2 sm:my-8 ">
                                <div
                                    className={` px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ${
                                        theme === "light"
                                            ? "bg-light-background text-light-text"
                                            : theme === "dark"
                                            ? "bg-dark-background text-dark-text"
                                            : "bg-trueDark-background text-trueDark-text"
                                    }`}
                                >
                                    {detailsForModal?.isGroup ? (
                                        <div className="sm:flex sm:items-center">
                                            <div className="flex h-48 w-48 flex-shrink-0 justify-center items-center mx-auto">
                                                <FontAwesomeIcon
                                                    className="w-48 h-48 mx-1"
                                                    icon={faPeopleGroup}
                                                    style={{
                                                        color:
                                                            theme! == "light"
                                                                ? "#000"
                                                                : "#fff",
                                                    }}
                                                    size="xl"
                                                />
                                            </div>
                                            <div className="mt-3 text-left w-full items-center sm:ml-4 sm:mt-0">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="font-bold text-center text-5xl m-2"
                                                >
                                                    {detailsForModal?.groupName}
                                                </Dialog.Title>
                                                <div
                                                    className={`mt-10 rounded-lg shadow-sm shadow-gray-800 max-h-48 overflow-y-auto scroll-smooth ${
                                                        theme === "light"
                                                            ? "bg-light-options text-light-text"
                                                            : theme === "dark"
                                                            ? "bg-dark-options text-dark-text"
                                                            : "bg-trueDark-options text-trueDark-text"
                                                    }`}
                                                >
                                                    {detailsForModal?.users.map(
                                                        (
                                                            user: any,
                                                            index: number
                                                        ) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`py-2 px-5 sm:px-10 lg:px-20 w-full flex justify-items-start  items-center border-b ${
                                                                        theme ===
                                                                        "light"
                                                                            ? "border-b-gray-300"
                                                                            : "border-b-gray-700"
                                                                    }`}
                                                                >
                                                                    <Image
                                                                        className={`object-cover mx-5 lg:mx-10 w-14 h-14 rounded-full ${
                                                                            theme !==
                                                                                "light" &&
                                                                            !user.profileImage
                                                                                ? "invert"
                                                                                : ""
                                                                        }`}
                                                                        src={
                                                                            user.profileImage
                                                                                ? user.profileImage
                                                                                : AvatarIcon
                                                                        }
                                                                        alt={
                                                                            "AvatarIcon"
                                                                        }
                                                                        width={
                                                                            50
                                                                        }
                                                                        height={
                                                                            50
                                                                        }
                                                                    />
                                                                    {
                                                                        user.firstName
                                                                    }{" "}
                                                                    {
                                                                        user.lastName
                                                                    }{" "}
                                                                    (
                                                                    {user.email}
                                                                    )
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        detailsForModal.users && (
                                            <div className="sm:flex sm:items-center">
                                                <div className="flex h-48 w-48 flex-shrink-0 justify-center items-center mx-auto">
                                                    <Image
                                                        className={`object-cover w-48 h-48 mx-1 rounded-full ${
                                                            theme !== "light" &&
                                                            !detailsForModal
                                                                .users[0]
                                                                .profileImage
                                                                ? "invert"
                                                                : ""
                                                        }`}
                                                        src={
                                                            detailsForModal
                                                                .users[0]
                                                                .profileImage
                                                                ? detailsForModal
                                                                      .users[0]
                                                                      .profileImage
                                                                : AvatarIcon
                                                        }
                                                        alt={"AvatarIcon"}
                                                        width={50}
                                                        height={50}
                                                    />
                                                </div>
                                                <div className="mt-3 text-left w-full items-center sm:ml-4 sm:mt-0">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="font-bold text-5xl"
                                                    >
                                                        {
                                                            detailsForModal
                                                                ?.users[0]
                                                                ?.firstName
                                                        }{" "}
                                                        {
                                                            detailsForModal
                                                                ?.users[0]
                                                                ?.lastName
                                                        }
                                                    </Dialog.Title>
                                                    <div
                                                        className={`mt-8 rounded-lg p-2 font-thin ${
                                                            theme === "light"
                                                                ? "bg-light-options text-light-text"
                                                                : theme ===
                                                                  "dark"
                                                                ? "bg-dark-options text-dark-text"
                                                                : "bg-trueDark-options text-trueDark-text"
                                                        }`}
                                                    >
                                                        <p className="text-lg m-2">
                                                            Email:{" "}
                                                            {
                                                                detailsForModal
                                                                    ?.users[0]
                                                                    ?.email
                                                            }
                                                        </p>
                                                        <p className="text-lg m-2">
                                                            Status:{" "}
                                                            {
                                                                detailsForModal
                                                                    ?.users[0]
                                                                    ?.status
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <hr />
                                <div
                                    className={`px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 ${
                                        theme === "light"
                                            ? "bg-light-background text-light-text"
                                            : theme === "dark"
                                            ? "bg-dark-background text-dark-text"
                                            : "bg-trueDark-background text-trueDark-text"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() =>
                                            setShowProfileFlag(false)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
