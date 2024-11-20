"use client";

import { toast } from "react-toastify";
import { ROLE_ADMIN } from "./constants";
import { FaGamepad, FaStore, FaSignInAlt, FaCogs } from "react-icons/fa";
import { IoPersonCircleOutline, IoSettings } from "react-icons/io5";
import { AiOutlineDashboard } from "react-icons/ai";
import { ReactNode } from "react";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: string[];
}

export const sliderMenu = [
  {
    key: "dashboard",
    icon: <AiOutlineDashboard />,
    label: "Dashboard",
    roles: [ROLE_ADMIN],
  },
  {
    key: "user",
    icon: <IoPersonCircleOutline />,
    label: "Người dùng",
    roles: [ROLE_ADMIN],
  },
] as SliderMenuItem[];

export const item_list_home = [
  {
    icon: <FaGamepad className="mb-1 text-3xl" />,
    name: "Play",
    link: "play",
    key: "play",
    active: true,
  },
  {
    icon: <FaStore className="mb-1 text-3xl" />,
    name: "Shop",
    link: "shop",
    key: "shop",
    active: true,
  },
  {
    icon: <IoSettings className="mb-1 text-3xl" />,
    name: "Settings",
    link: "setting",
    key: "settings",
    active: false,
  },
  {
    icon: <FaSignInAlt className="mb-1 text-3xl" />,
    name: "Logout",
    link: "",
    key: "logout",
    active: true,
  },
];

export const play_mode_list = [
  {
    name: "multiplayer",
    link: "multiplayer",
  },
  { name: "play with bot", link: "playwithbot" },
];

export const handleActionNotSupport = () => {
  toast.warning("This feature is not available now!");
};

export const toastError = (error: any) => {
  const messages = error?.response?.data || error?.response?.data?.message;

  if (Array.isArray(messages)) {
    const combinedMessage = messages.join("\n");
    toast.error(combinedMessage);
  } else {
    toast.error(messages || error.message || "An error occurred");
  }
};
