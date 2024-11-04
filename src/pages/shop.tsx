import HeaderBack from "@layout/components/header/HeaderBack";
import HomeLayout from "@layout/HomeLayout";
import { BuyItem, BuyStamina } from "@models/tool";
import tool from "@services/tool";
import transaction from "@services/transaction";
import { toastError } from "@utils/global";
import { formatNumberWithCommas } from "@utils/helpers";
import { Modal } from "antd";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateCoins, updateStaminas } from "@slices/player";
import useDispatch from "@hooks/use-dispatch";

const { confirm } = Modal;

const ShopPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const shop_items = [
    {
      section: "Tool & Stamina",
      list_items: [
        {
          icon: "/images/hint.png",
          amount_quantity: "1",
          amount_money: 20,
          key: "hint",
        },
        {
          icon: "/images/stamina.png",
          amount_quantity: "50",
          amount_money: 20,
          key: "stamina",
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
        },
        {
          icon: "/images/package_2.png",
          amount_quantity: "100",
          amount_money: 50000,
          key: "package_2",
        },
        {
          icon: "/images/package_3.png",
          amount_quantity: "200",
          amount_money: 100000,
          key: "package_3",
        },
        {
          icon: "/images/package_4.png",
          amount_quantity: "400",
          amount_money: 200000,
          key: "package_4",
        },
      ],
      key: "coin",
      type: "coin",
    },
  ];

  const handleConfirm = async (item: any, quantity: number | null) => {
    confirm({
      cancelText: "Go back",
      okText: "Confirm",
      title: `Are you sure want to buy '${item.key}'?`,
      async onOk() {
        if (session?.user.access_token) {
          try {
            switch (item.key) {
              case "hint":
                const dataBuyItem: BuyItem = {
                  item_id: "6723a03e4ed53c7ec7bf5d1a",
                  quantity: quantity ?? 1,
                };

                const resultBuyHint = await tool.buyItem(
                  session.user.access_token,
                  dataBuyItem
                );

                dispatch(updateCoins(resultBuyHint.coins));
                toast.success("Buy item hint successfully!");

                break;

              case "stamina":
                const dataBuyStamina: BuyStamina = {
                  quantity: quantity ?? 1,
                };

                const resultBuyStamina = await tool.buyStamina(
                  session.user.access_token,
                  dataBuyStamina
                );

                dispatch(updateStaminas(resultBuyStamina.stamina));
                dispatch(updateCoins(resultBuyStamina.coins));

                toast.success("Buy stamina successfully!");

                break;
              default:
                const result = await transaction.createPayOsUrl(
                  session?.user.access_token,
                  item.amount_money
                );
                console.log(result);
                window.location.href = result.paymentUrl;

                break;
            }
          } catch (error: any) {
            toastError(error);
          }
        }
      },
      onCancel() {},
    });
  };

  const showQuantityModal = (item: any) => {
    if (item.key === "hint" || item.key === "stamina") {
      let inputQuantity = 1;

      const modal = confirm({
        title: `Enter quantity for '${item.key}'`,
        content: (
          <div className="flex flex-row justify-center items-center pt-4 gap-2">
            <input
              type="number"
              min="1"
              defaultValue={inputQuantity}
              onChange={(e) => (inputQuantity = Number(e.target.value))}
              className="w-20 text-center text-lg"
            />
            <div className="flex flex-row justify-center items-center">
              <p className="font-semibold">x {item.amount_quantity}</p>
              <img
                src={item.icon}
                alt={item.key}
                className="w-10 h-10 object-cover"
              />
            </div>
          </div>
        ),
        cancelText: "Cancel",
        okText: "Confirm",
        onOk() {
          modal.destroy();
          handleConfirm(item, inputQuantity);
        },
        onCancel() {
          modal.destroy();
        },
      });
    } else {
      handleConfirm(item, null);
    }
  };

  return (
    <>
      <HeaderBack namePage={"shop"} />

      <div className="container">
        <div className="px-8 py-8 ">
          {shop_items.map((section, indexSection) => (
            <div key={section.key}>
              <h1 className="text-center text-2xl my-4">{section.section}</h1>

              <div className="flex justify-center gap-4">
                {section.list_items.map((item, indexItem) => (
                  <div
                    key={item.key}
                    className="bg-white shadow-md rounded-lg w-[140px] hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => showQuantityModal(item)}
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
  );
};

export default ShopPage;
