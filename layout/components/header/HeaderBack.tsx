import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

interface Props {
  namePage: string;
}

const HeaderBack: React.FC<Props> = (props) => {
  const { namePage } = props;
  const router = useRouter();

  return (
    <div className="container bg-white shadow-md rounded-lg">
      <div className="px-8 py-3 grid grid-cols-3">
        <IoIosArrowRoundBack
          className="cursor-pointer w-10 h-10"
          onClick={() => router.push("/")}
        />
        <p className="capitalize text-2xl font-bold text-center">{namePage}</p>
      </div>
    </div>
  );
};

export default HeaderBack;
