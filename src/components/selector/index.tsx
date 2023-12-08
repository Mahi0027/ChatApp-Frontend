import { dashboardContext } from "@/src/context";
import {
    faChevronUp,
    faClose,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";

type ConversationListType = {
    label: string;
    name: string;
    placeholder: string;
    value: any;
    setSelectedListData: (arg0: any) => void;
};

const Selector = ({
    label = "",
    name = "",
    placeholder = "",
    value = [],
    setSelectedListData,
}: ConversationListType) => {
    const { theme } = useContext(dashboardContext);
    const [open, setOpen] = useState(false);
    const [lists, setLists] = useState(value);
    const [inputValue, setInputValue] = useState("");
    const [selectedValues, setSelectedValues] = useState<any>([]);
    const [selectedValuesDetail, setSelectedValuesDetail] = useState([]);
    useEffect(() => {
        if (selectedValues.length) {
            const filterValues = lists
                .filter((list: { id: string; value: string }) =>
                    selectedValues.includes(list.id)
                )
                .map((list: { id: string; value: string }) => list);
            setSelectedValuesDetail(filterValues);
        } else {
            setSelectedValuesDetail([]);
        }
        setSelectedListData((prevData: any) => ({
            ...prevData,
            users: selectedValues,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedValues]);

    const removeFromSelected = (removeItem: any) => {
        const newSelectedValues = selectedValues.filter(
            (item: string) => item !== removeItem
        );
        setSelectedValues(newSelectedValues);
    };
    return (
        <div className="w-5/6 font-medium">
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-gray-500"
            >
                {label}
            </label>
            <div
                onClick={() => setOpen(!open)}
                className={`w-full p-2 flex items-center justify-between rounded-lg ${
                    theme !== undefined && theme !== "light"
                        ? "bg-gray-700  text-gray-100 border-gray-500"
                        : "bg-gray-50 text-gray-900 border-gray-300"
                }`}
            >
                <div className="flex items-start justify-start overflow-x-auto max-w-5xl text-gray-400">
                    {selectedValuesDetail.length === 0
                        ? "Please select value"
                        : selectedValuesDetail.map(({ id, value }, index) => (
                              <div
                                  key={index}
                                  className="border border-spacing-2 rounded-full border-sky-400 mx-2 px-1 flex items-center justify-between"
                              >
                                  <div className="px-2 text-gray-300">
                                      {value}
                                  </div>
                                  <FontAwesomeIcon
                                      icon={faClose}
                                      style={{
                                          color:
                                              theme === "light"
                                                  ? "#000"
                                                  : "#fff",
                                      }}
                                      className="w-3 h-3 p-[0.10rem] border border-spacing-2 border-red-400 rounded-full hover:scale-125 transition-all"
                                      onClick={() => {
                                          setOpen((prevValue) => !prevValue);
                                          removeFromSelected(id);
                                      }}
                                  />
                              </div>
                          ))}
                </div>
                <FontAwesomeIcon
                    icon={faChevronUp}
                    rotation={open ? undefined : 180}
                    className="transition-all"
                    style={{
                        color: theme === "light" ? "#000" : "#fff",
                    }}
                />
            </div>
            <ul
                className={`mt-2 max-h-48 overflow-y-auto  ${
                    open ? "block" : "hidden"
                } ${
                    theme !== undefined && theme !== "light"
                        ? "bg-gray-700  text-gray-10Z0 border-gray-500"
                        : "bg-gray-50 text-gray-900 border-gray-300"
                }`}
            >
                <div
                    className={`p-2 sticky top-0 ${
                        theme !== undefined && theme !== "light"
                            ? "bg-gray-700  text-gray-100 border-gray-500"
                            : "bg-gray-50 text-gray-900 border-gray-300"
                    }`}
                >
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="text-gray-300"
                    />
                    <input
                        type="text"
                        placeholder={placeholder}
                        className={`placeholder:text-gray-300 p-2 outline-none ${
                            theme !== undefined && theme !== "light"
                                ? "bg-gray-700  text-gray-100 border-gray-500"
                                : "bg-gray-50 text-gray-900 border-gray-300"
                        }`}
                        value={inputValue}
                        onChange={(e) =>
                            setInputValue(e.target.value.toLowerCase())
                        }
                    />
                </div>
                {lists.map((list: any) => (
                    <li
                        key={list.id}
                        className={`p-2 text-sm hover:bg-sky-400 hover:text-white ${
                            list.value.toLowerCase().startsWith(`${inputValue}`)
                                ? "block"
                                : "hidden"
                        } ${
                            selectedValues.includes(list.id)
                                ? "bg-sky-400 text-white"
                                : ""
                        }`}
                        onClick={() => {
                            const newSelectedValue = [
                                ...selectedValues,
                                list.id,
                            ];
                            setSelectedValues(newSelectedValue);
                        }}
                    >
                        {list.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Selector;
