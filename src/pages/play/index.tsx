import HeaderBack from "@layout/components/header/HeaderBack";
import { play_mode_list } from "@utils/global";
import { useRouter } from "next/navigation";
import React from "react";

const PlayPage = () => {
  const router = useRouter();

  return (
    <>
      <HeaderBack namePage={"game mode"} />
      <div className="my-7 play-container">
        <div className="container bg-white shadow-md rounded-lg w-full min-h-full flex flex-col justify-center items-center gap-10">
          {play_mode_list.map((item, index) => (
            <div
              className="w-40 shadow-md rounded-2xl bg-orange-200 hover:bg-orange-400 transition-all duration-300 py-3 px-6 cursor-pointer"
              key={index}
              onClick={() => router.push(`/play/${item.link}`)}
            >
              <p className="capitalize text-black text-xl font-bold text-center">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlayPage;
