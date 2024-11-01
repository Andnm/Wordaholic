"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Modal } from "antd";
import HomeLayout from "@layout/HomeLayout";
import { useRouter } from "next/router";
import { handleActionNotSupport, item_list_home } from "@utils/global";
import { signOut } from "next-auth/react";

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <HomeLayout
      content={
        <div className="container bg-white shadow-md rounded-lg">
          <div className="p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Main Navigation
            </h2>
            <div className="flex items-center justify-around text-gray-600">
              {item_list_home.map((item, index) => (
                <div
                  key={item.key}
                  className={`${
                    item.key === "logout"
                      ? "hover:text-red-600"
                      : "hover:text-green-600"
                  } flex flex-col items-center text-gray-600 transition-all duration-200 cursor-pointer`}
                  onClick={
                    item?.key !== "logout"
                      ? () => router.push(`/${item.link}`)
                      : () => {
                          signOut();
                        }
                  }
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
