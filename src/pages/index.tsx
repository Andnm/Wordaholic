"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Modal } from "antd";
import HomeLayout from "@layout/HomeLayout";
import { useRouter } from "next/router";
import { FaGamepad, FaStore, FaSignInAlt, FaCogs } from "react-icons/fa";
import { handleActionNotSupport } from "@utils/global";
import { IoSettings } from "react-icons/io5";

const HomePage: React.FC = () => {
  const router = useRouter();

  const items_list = [
    {
      icon: <FaGamepad className="mb-1 text-3xl" />,
      name: "Play",
      action: () => router.push("/play"),
      key: "play",
    },
    {
      icon: <FaStore className="mb-1 text-3xl" />,
      name: "Shop",
      action: () => router.push("/shop"),
      key: "shop",
    },
    {
      icon: <IoSettings className="mb-1 text-3xl" />,
      name: "Settings",
      action: () => router.push("/setting"),
      key: "settings",
    },
    {
      icon: <FaSignInAlt className="mb-1 text-3xl" />,
      name: "Logout",
      action: () => handleActionNotSupport(),
      key: "logout",
    },
  ];

  return (
    <HomeLayout
      content={
        <div className="container bg-white shadow-md rounded-lg">
          <div className="p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Main Navigation
            </h2>
            <div className="flex items-center justify-around text-gray-600">
              {items_list.map((item, index) => (
                <div
                  key={item.key}
                  className={`${
                    item.key === "logout"
                      ? "hover:text-red-600"
                      : "hover:text-green-600"
                  } flex flex-col items-center text-gray-600 transition-all duration-200 cursor-pointer`}
                  onClick={item.action}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default HomePage;
