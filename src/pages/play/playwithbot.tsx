"use client";

import HomeLayout from "@layout/HomeLayout";
import React, { useEffect, useState } from "react";
import InputSendMessage from "../../../components/playComponent/InputSendMessage";
import room from "@services/room";
import { useSession } from "next-auth/react";
import { MeaningWord, UpdatePlayBotTurn } from "@models/room";
import { useRouter } from "next/navigation";
import { Button, Modal, Spin } from "antd";
import { toastError } from "@utils/global";
import HeaderBack from "@layout/components/header/HeaderBack";
import useDispatch from "@hooks/use-dispatch";
import {
  decreaseStaminas,
  increaseStaminas,
  updateCoins,
} from "@slices/player";
import useSelector from "@hooks/use-selector";
import { formatTime } from "@utils/helpers";
import { AiOutlineSound } from "react-icons/ai";
import customer from "@services/customer";

const MAX_COUNTDOWN = 30;

const Playwithbot = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const coins = useSelector((state) => state.player.coins);
  const staminas = useSelector((state) => state.player.staminas);

  const [message, setMessage] = useState<string>("");
  const [botWord, setBotWord] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(MAX_COUNTDOWN);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [meaningWords, setMeaningWords] = useState<MeaningWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMeaning, setIsLoadingMeaning] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (message.trim() && gameActive) {
      const data: UpdatePlayBotTurn = {
        usedWords: usedWords,
        word: message.toLocaleLowerCase()!,
      };

      if (session?.user.access_token) {
        try {
          const response = await room.playTurnWithBot(
            session.user.access_token,
            data
          );

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
      const fetchCustomers = async () => {
        if (session?.user.access_token) {
          setIsLoading(true);
          try {
            const responseAddCoinToUser = await customer.addCoinToUser(
              session.user.access_token
            );

            dispatch(updateCoins(coins + 5));
          } catch (error: any) {
            toastError(error);
            console.error("Có lỗi khi tải dữ liệu:", error);
          } finally {
            setIsLoading(false);
          }
        }
      };

      fetchCustomers();

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

  useEffect(() => {
    const fetchMeaning = async () => {
      setIsLoadingMeaning(true);

      if (botWord) {
        try {
          const responseMeaningWord = await room.getMeaningWord(botWord);

          setMeaningWords(responseMeaningWord);
        } catch (error) {
          toastError(error);
        } finally {
          setIsLoadingMeaning(false);
        }
      }
    };

    fetchMeaning();
  }, [botWord]);

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

              {meaningWords.length > 0 && !isLoadingMeaning && (
                <div className="meaning-container max-w-96 flex flex-col gap-4  justify-center">
                  {meaningWords.map((meaningWord, index) => (
                    <div key={index} className="meaning-item">
                      <div className="phonetic flex items-center justify-center gap-2">
                        {meaningWord.phonetic && (
                          <>
                            <p className="text-center text-lg font-light">
                              {meaningWord.phonetic}
                            </p>
                            {meaningWord.phonetics.length > 0 &&
                              meaningWord.phonetics[0].audio &&
                              meaningWord.phonetics[0].audio !== "" && (
                                <button
                                  className={`voice-button hover:shadow-lg bg-white`}
                                  onClick={() => {
                                    const audio = new Audio(
                                      meaningWord.phonetics[0].audio
                                    );
                                    audio.play();
                                  }}
                                >
                                  <AiOutlineSound className="w-5 h-5 text-black" />{" "}
                                </button>
                              )}
                          </>
                        )}
                      </div>

                      {meaningWord.meanings.map((meaning, idx) => (
                        <div key={idx} className="part-of-speech">
                          <strong className="capitalize text-base">
                            {meaning.partOfSpeech}
                          </strong>
                          <div className="definitions">
                            {meaning.definitions.length > 0 && (
                              <p className="text-base text-justify">
                                {meaning.definitions[0].definition}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {isLoadingMeaning && (
                <div className="flex items-center">
                  <Spin size="small" style={{ marginRight: 8 }} />
                  <span className="">Taking meaning...</span>
                </div>
              )}

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
