"use client";
import toast from "react-hot-toast";

export const successToast = (message: string) => {
    return toast.success(message);
};

export const errorToast = (message: string) => {
    return toast.error(message);
};
