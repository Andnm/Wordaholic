import HeaderBack from "@layout/components/header/HeaderBack";
import HomeLayout from "@layout/HomeLayout";
import { formatNumberWithCommas } from "@utils/helpers";
import React from "react";

const ShopPage = () => {
  const shop_items = [
    {
      section: "Tool & Stamina",
      list_items: [
        {
          icon: "/images/hint.png",
          amount_quantity: "1",
          amount_money: 20,
          key: "hint",
          action: () => {},
        },
        {
          icon: "/images/stamina.png",
          amount_quantity: "50",
          amount_money: 20,
          key: "stamina",
          action: () => {},
        },
      ],
      key: "tool & stamina",
      type: "item",
    },
    {
      section: "Coin",
      list_items: [
        {
          icon: "/images/package_1.png",
          amount_quantity: "50",
          amount_money: 25000,
          key: "package_1",
          action: () => {},
        },
        {
          icon: "/images/package_2.png",
          amount_quantity: "100",
          amount_money: 50000,
          key: "package_2",
          action: () => {},
        },
        {
          icon: "/images/package_3.png",
          amount_quantity: "200",
          amount_money: 100000,
          key: "package_3",
          action: () => {},
        },
        {
          icon: "/images/package_4.png",
          amount_quantity: "400",
          amount_money: 200000,
          key: "package_4",
          action: () => {},
        },
      ],
      key: "coin",
      type: "coin",
    },
  ];

  return (
    <HomeLayout
      content={
        <>
          <div className="container bg-white shadow-md rounded-lg">
            <HeaderBack namePage={"shop"} />
          </div>

          <div className="container">
            <div className="px-8 py-3 ">
              {shop_items.map((section, indexSection) => (
                <div key={section.key}>
                  <h1 className="text-center text-2xl my-4">
                    {section.section}
                  </h1>

                  <div className="flex justify-center gap-4">
                    {section.list_items.map((item, indexItem) => (
                      <div
                        key={item.key}
                        className="bg-white shadow-md rounded-lg w-[140px] hover:scale-105 transition-all duration-200 cursor-pointer"
                        onClick={item.action}
                      >
                        <div className="flex flex-col justify-center items-center pt-4">
                          <img
                            src={item.icon}
                            alt={item.key}
                            className="w-14 h-14 object-cover"
                          />
                          <p className="font-semibold">
                            {section.type === "item"
                              ? `x ${item.amount_quantity}`
                              : `${item.amount_quantity} coin`}
                          </p>
                        </div>
                        <hr />
                        <div className="px-5 pb-3 text-center">
                          {section.type === "item" ? (
                            <div className="relative">
                              <p className="text-center font-bold text-2xl">
                                {formatNumberWithCommas(item.amount_money)}
                              </p>
                              <img
                                src="images/star.png"
                                alt="coins"
                                className="w-8 h-8 absolute bottom-0 right-0"
                              />
                            </div>
                          ) : (
                            <p className="text-center font-bold text-xl">
                              {formatNumberWithCommas(item.amount_money)}đ
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      }
    />
  );
};

export default ShopPage;
