"use client";

import { toast } from "react-toastify";
import { ROLE_ADMIN } from "./constants";

export const handleActionNotSupport = () => {
  toast.warning("Tính năng chưa hỗ trợ");
};

export const toastError = (error: any) => {
  const messages = error?.response?.data?.message;

  if (Array.isArray(messages)) {
    const combinedMessage = messages.join("\n");
    toast.error(combinedMessage);
  } else {
    toast.error(messages || error.message || "An error occurred");
  }
};

