"use client";

import { PlayerInMatchType, RoomType, UpdatePlayerTurn } from "@models/room";
import { formatTime, generateFallbackAvatar } from "@utils/helpers";
import React, { useContext, useEffect, useState } from "react";
import InputSendMessage from "./InputSendMessage";
import Image from "next/image";
import { Modal } from "antd";
import { CiFaceFrown } from "react-icons/ci";
import { useSession } from "next-auth/react";
import room from "@services/room";
import { toastError } from "@utils/global";
import { SocketContext } from "@/pages/_app";
import tool from "@services/tool";
import { ToolType } from "@models/tool";
import { toast } from "react-toastify";
import { HiOutlineLightBulb } from "react-icons/hi";

interface Props {
  roomInfo: RoomType | null;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomType | null>>;
  roomId: string | null;
}

const MAX_COUNTDOWN = 1000000;

const MultiplayerScreen: React.FC<Props> = (props) => {
  const { roomInfo, setRoomInfo, roomId } = props;
  const { data: session } = useSession();

  const socketContext = useContext(SocketContext);

  const [countdown, setCountdown] = useState<number>(MAX_COUNTDOWN);
  const [message, setMessage] = useState<string>("");
  const [isLoseModalVisible, setIsLoseModalVisible] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  const [listTools, setListTools] = useState<ToolType[] | null>(null);

  useEffect(() => {
    if (countdown === 0) {
      handleTimeOut();
    }

    let timer: NodeJS.Timeout;

    timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  const handleTimeOut = async () => {
    if (session?.user.access_token && roomInfo) {
      try {
        const response = await room.removePlayerFromMatch(
          session?.user.access_token,
          roomInfo?._id
        );
      } catch (error) {
        console.error("Error removing player:", error);
      }
    }
  };

  useEffect(() => {
    if (roomInfo && session?.user.userId) {
      const isPlayerInMatch = roomInfo.players_in_match.some(
        (player) => player.user_id._id === session.user.userId
      );

      if (!isPlayerInMatch && roomInfo.players_in_match.length > 2) {
        setIsLoseModalVisible(true);
        setHasLost(true);
      }
    }
  }, [roomInfo, session?.user.userId]);

  useEffect(() => {
    if (hasLost && roomInfo) {
      if (roomInfo.usedWords.length > 0) {
        setCountdown(MAX_COUNTDOWN);
      }
    }
  }, [hasLost, roomInfo?.usedWords.length]);

  const isCurrentPlayerTurn = roomInfo?.players_in_match?.some(
    (player) => player.user_id._id === session?.user.userId && player.is_playing
  );

  const handleSendMessage = async () => {
    if (message.trim() && session?.user.access_token) {
      try {
        const data: UpdatePlayerTurn = {
          room_id: roomInfo?._id!,
          word: message.toLocaleLowerCase()!,
        };

        const response = await room.playTurnWithPlayer(
          session?.user.access_token,
          data
        );

        if (roomInfo) {
          setMessage("");
          setCountdown(MAX_COUNTDOWN);
        }
      } catch (error) {
        toastError(error);
        console.error("Error playing turn:", error);
      }
    }
  };

  const handleLoseModalClose = () => {
    setIsLoseModalVisible(false);
  };

  useEffect(() => {
    if (!socketContext?.socket || !roomId) return;

    socketContext.socket.on(`room-${roomId}`, (updatedRoom: RoomType) => {
      setRoomInfo(updatedRoom);
    });

    return () => {
      socketContext.socket!.off(`room-${roomId}`);
    };
  }, [socketContext?.socket, roomId]);

  //xử lý tool
  useEffect(() => {
    const fetchTools = async () => {
      if (session?.user.access_token && roomId) {
        try {
          const responseGetTools = await tool.getAllTool(
            session?.user.access_token
          );

          console.log("responseGetTools: ", responseGetTools);
          setListTools(responseGetTools);
        } catch (error) {
          toastError(error);
        }
      }
    };

    fetchTools();
  }, [session?.user.access_token, roomId]);

  const handleUseHint = async (item: ToolType) => {
    if (!isCurrentPlayerTurn || !session?.user.access_token || !roomId) return;

    try {
      const response = await tool.useHint(session.user.access_token, roomId);
      setMessage(response.hintWord);
      toast.success("Use tool successfully");

      setListTools((prevTools) => {
        if (prevTools) {
          return prevTools.map((tool) => {
            if (tool.item_id._id === item.item_id._id) {
              return { ...tool, quantity: tool.quantity - 1 };
            }
            return tool;
          });
        }
        return prevTools;
      });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className="mode-container relative container flex justify-between items-center flex-col">
      <div className="absolute left-0 top-10 bg-white p-4 rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-bold">Player Order</h3>
        <div className="space-y-4">
          {roomInfo?.players_in_match
            .sort((a, b) => a.no - b.no)
            .map((player: PlayerInMatchType, index) => {
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`relative w-10 h-10 rounded-full overflow-hidden
                    ${
                      player.is_playing
                        ? "ring-2 ring-yellow-400"
                        : "opacity-20"
                    }`}
                  >
                    <Image
                      src={
                        player?.user_id.avatar ||
                        generateFallbackAvatar(player?.user_id.email)
                      }
                      alt={`avatar`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <span
                    className={`
                    ${player.is_playing ? "" : "opacity-20"}`}
                  >
                    {player?.user_id.fullname ||
                      player?.user_id.email ||
                      "Unknown Player"}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* loser */}
      <Modal
        title={
          <div className="text-center text-2xl text-red-500">You Lose!</div>
        }
        open={isLoseModalVisible}
        onCancel={handleLoseModalClose}
        footer={null}
        centered
      >
        <div className="text-center py-6">
          <CiFaceFrown className="text-6xl text-red-500 mb-4" />
          <p className="text-lg">Better luck next time!</p>
        </div>
      </Modal>

      <>
        <div className=" mt-10">
          <h3 className="text-center">{formatTime(countdown)}</h3>
        </div>
        <h2 className="text-4xl">{roomInfo?.current_word}</h2>
        <div></div>
        <div></div>
        <div></div>
      </>

      <div className="absolute right-0 top-10 bg-white p-4 rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-bold">Tools</h3>
        <div className="space-y-4">
          {listTools &&
            listTools?.map((item: ToolType, index) => {
              if (item.item_id.type === "Hint") {
                return (
                  <div key={index} className="text-center relative">
                    <div className="font-semibold absolute -bottom-2 -right-1">
                      x{item.quantity}
                    </div>
                    <button
                      onClick={
                        isCurrentPlayerTurn
                          ? () => handleUseHint(item)
                          : () => {}
                      }
                      disabled={!isCurrentPlayerTurn || item.quantity <= 0}
                      className={`p-1 rounded-full transition-all duration-300 border-none
                      ${
                        isCurrentPlayerTurn && item.quantity > 0
                          ? "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <HiOutlineLightBulb
                        className={`text-4xl ${
                          isCurrentPlayerTurn && item.quantity > 0
                            ? "text-white"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>

      {isCurrentPlayerTurn && (
        <InputSendMessage
          handleSendMessage={handleSendMessage}
          message={message}
          setMessage={setMessage}
        />
      )}
    </div>
  );
};

export default MultiplayerScreen;
