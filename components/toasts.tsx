"use client";
import toast from "react-hot-toast";

export const successToast = (message: string) => {
  if (!message) return;
  return toast.success(message);
};

export const errorToast = (message: string) => {
  if (!message) return;
  return toast.error(message);
};
