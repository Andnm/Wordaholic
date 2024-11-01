"use client";

import HomeLayout from "@layout/HomeLayout";
import React, { useEffect, useState } from "react";
import InputSendMessage from "./_components/InputSendMessage";

const Playwithbot = () => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <HomeLayout
      content={
        <>
          <div className="mode-container flex justify-between items-center flex-col">
            <div className="container bg-white shadow-md rounded-lg w-full flex flex-col justify-center items-center gap-10">
              asd
            </div>

            <InputSendMessage
              handleSendMessage={handleSendMessage}
              message={message}
              setMessage={setMessage}
            />
          </div>
        </>
      }
    ></HomeLayout>
  );
};

export default Playwithbot;
