"use client";
import React from "react";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";

import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "antd";
import { formatCoins, generateFallbackAvatar } from "@utils/helpers";

const HeaderAuthen = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any | null>(null);
  const pathName = usePathname();

  return (
    <div className="container-background pb-7">
      <div className="container relative top-0 z-10 bg-white general-header-container flex flex-col justify-between rounded-lg shadow-md">
        <div className="p-8">
          <div className="">
            <h1
              className="text-2xl uppercase font-extrabold"
              onClick={() => router.push("/")}
            >
              wordaholic
            </h1>
          </div>

          <div className="flex flex-row justify-between items-center mt-3">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={
                  // customer.avatar_url ||
                  generateFallbackAvatar("fullname")
                }
                alt="fullname"
                style={{ marginRight: "15px", border: "1px solid #d9d9d9" }}
                size={55}
              />
              <div>
                <p className="text-lg font-bold">fullname</p>
                {/* <p className="text-base">free</p> */}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="flex flex-row items-center justify-between relative h-7 w-28 shadow-md rounded-lg"
                style={{ backgroundColor: "#FEF7E6" }}
              >
                <FaPlusCircle className="plus-icon absolute top-0 -left-4 w-7 h-7 cursor-pointer" />
                <p className="text-center w-full text-sm font-semibold">
                  150/200
                </p>
                <div className="stamina-item absolute top-0 -right-3 w-7 h-7">
                  <img src="/images/stamina.png" className="w-full h-full" />
                </div>
              </div>

              <div
                className="flex flex-row items-center justify-between relative h-7 w-28 shadow-md rounded-lg"
                style={{ backgroundColor: "#FEF7E6" }}
              >
                <FaPlusCircle className="plus-icon absolute top-0 -left-4 w-7 h-7 cursor-pointer transition-all duration-300" />
                <p className="text-center w-full text-sm font-semibold">
                  {formatCoins(2000000)}
                </p>
                <div className="stamina-item absolute -top-1 -right-3 w-9 h-9">
                  <img src="/images/star.png" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAuthen;
