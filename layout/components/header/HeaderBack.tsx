import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

interface Props {
  namePage: any;
  link?: string;
  actionLeaveRoom?: () => Promise<void>;
}

const HeaderBack: React.FC<Props> = (props) => {
  const { namePage, link = "/", actionLeaveRoom } = props;
  const router = useRouter();

  const handleBackClick = async () => {
    if (actionLeaveRoom) {
      await actionLeaveRoom();
    }
    router.back();
  };

  return (
    <div className="container bg-white shadow-md rounded-lg">
      <div className="px-8 py-3 grid grid-cols-3 items-center">
        <IoIosArrowRoundBack
          className="cursor-pointer w-10 h-10"
          onClick={handleBackClick}
        />
        <div className="capitalize text-2xl font-bold text-center">{namePage}</div>
      </div>
    </div>
  );
};

export default HeaderBack;
