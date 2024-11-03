"use client";

import HomeLayout from "@layout/HomeLayout";
import React, { useEffect, useState } from "react";
import InputSendMessage from "../../../components/playComponent/InputSendMessage";
import room from "@services/room";
import { useSession } from "next-auth/react";
import { UpdatePlayBotTurn } from "@models/room";
import { useRouter } from "next/navigation";
import { Button, Modal, Spin } from "antd";
import { toastError } from "@utils/global";
import HeaderBack from "@layout/components/header/HeaderBack";
import useDispatch from "@hooks/use-dispatch";
import { decreaseStaminas, increaseStaminas } from "@slices/player";
import useSelector from "@hooks/use-selector";
import { formatTime } from "@utils/helpers";

const MAX_COUNTDOWN = 30;

const Playwithbot = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const staminas = useSelector((state) => state.player.staminas);

  const [message, setMessage] = useState<string>("");
  const [botWord, setBotWord] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(MAX_COUNTDOWN);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (message.trim() && gameActive) {
      const data: UpdatePlayBotTurn = {
        usedWords: usedWords,
        word: message.toLocaleLowerCase()!,
      };

      console.log("data: ", data);

      if (session?.user.access_token) {
        try {
          const response = await room.playTurnWithBot(
            session.user.access_token,
            data
          );

          console.log("response bot: ", response);
          setUsedWords(response.usedWords);
          setBotWord(response.newWord);
          setMessage("");
          setCountdown(MAX_COUNTDOWN);
        } catch (error) {
          console.log("error: ", error);
          toastError(error);
        }
      }
    }
  };

  const handleStartGame = async () => {
    if (staminas <= 4) {
      toastError("You are not enough stamina, please try again later!");
      return;
    }

    if (session?.user.access_token) {
      setIsLoading(true);
      try {
        const response = await room.startWithBot(session.user.access_token);
        dispatch(decreaseStaminas(5));
        setMessage("");
        setUsedWords([response.word]);
        setBotWord(response.word);
        setGameActive(true);
        setCountdown(MAX_COUNTDOWN);
      } catch (error) {
        toastError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (gameActive && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && gameActive) {
      Modal.confirm({
        title: "YOU LOSE!",
        content: "Do you want to play again?",
        onOk: () => handleStartGame(),
        onCancel: () => router.push("/play"),
        okText: "Play again",
        cancelText: "Go back",
      });
      setGameActive(false);
    }
  }, [countdown, gameActive]);

  return (
    <HomeLayout
      content={
        <div className="mode-container flex justify-between items-center flex-col">
          <HeaderBack namePage="Play With Bot" link="/play" />

          {gameActive && (
            <>
              <div className="">
                <h3 className="text-center">{formatTime(countdown)}</h3>
              </div>
              <h2 className="text-4xl">{botWord}</h2>
              <div></div>
              <div></div>
              <div></div>
            </>
          )}

          {isLoading ? (
            <div className="flex items-center">
              <Spin size="small" style={{ marginRight: 8 }} />
              <span className="">Bot is generating words...</span>
            </div>
          ) : (
            !gameActive && <div />
          )}

          {!gameActive && (
            <button
              onClick={handleStartGame}
              type="submit"
              className={`my-5 btn-action-login-register text-center text-xl cursor-pointer max-w-xs ${
                isLoading ? "loading-style" : ""
              }`}
              aria-disabled={isLoading}
              disabled={isLoading}
            >
              Start
            </button>
          )}

          {gameActive ? (
            <InputSendMessage
              handleSendMessage={handleSendMessage}
              message={message}
              setMessage={setMessage}
            />
          ) : (
            <div> </div>
          )}
        </div>
      }
    />
  );
};

export default Playwithbot;
