"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import HomeLayout from "@layout/HomeLayout";
import { useRouter } from "next/router";
import { handleActionNotSupport, item_list_home } from "@utils/global";
import { signOut, useSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import customer from "@services/customer";
import { updateCoins, updateStaminas } from "@slices/player";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      if (session?.user.access_token) {
        try {
          const resultCustomer = await customer.getProfileCustomer(
            session.user.access_token
          );
          dispatch(updateCoins(resultCustomer.coins));
          dispatch(updateStaminas(resultCustomer.stamina));
        } catch (error) {
          console.error("Failed to fetch customer profile:", error);
        }
      }
    };

    fetchCustomerProfile();
  }, [session?.user.access_token]);

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
                  onClick={() => {
                    if (!item?.active) {
                      handleActionNotSupport();
                    } else if (item?.key === "logout") {
                      signOut();
                    } else {
                      router.push(`/${item.link}`);
                    }
                  }}
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
