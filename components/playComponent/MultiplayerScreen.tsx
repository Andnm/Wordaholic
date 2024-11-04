"use client";

import { PlayerInMatchType, RoomType, UpdatePlayerTurn } from "@models/room";
import { formatTime, generateFallbackAvatar } from "@utils/helpers";
import React, { useContext, useEffect, useState } from "react";
import InputSendMessage from "./InputSendMessage";
import Image from "next/image";
import { Modal } from "antd";
import { CiFaceFrown, CiTrophy } from "react-icons/ci";
import { useSession } from "next-auth/react";
import room from "@services/room";
import { toastError } from "@utils/global";
import { SocketContext } from "@/pages/_app";

interface Props {
  roomInfo: RoomType | null;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomType | null>>;
  roomId: string | null;
}

const MAX_COUNTDOWN = 10;

const MultiplayerScreen: React.FC<Props> = (props) => {
  const { roomInfo, setRoomInfo, roomId } = props;
  const { data: session } = useSession();

  const socketContext = useContext(SocketContext);

  const [countdown, setCountdown] = useState<number>(MAX_COUNTDOWN);
  const [message, setMessage] = useState<string>("");
  const [isLoseModalVisible, setIsLoseModalVisible] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [leaderboard, setLeaderboard] = useState<string>("");
  const [isPlayerLost, setIsPlayerLost] = useState(false);

  useEffect(() => {
    if (countdown === 0 && !isPlayerLost) {
      handleTimeOut();
    }

    let timer: NodeJS.Timeout;
    if (!isPlayerLost) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown, isPlayerLost]);

  const handleTimeOut = async () => {
    if (session?.user.access_token && roomInfo) {
      try {
        setIsLoseModalVisible(true);

        const currentPlayerId = session?.user.userId;

        const playerToRemove = roomInfo.players_in_match.find(
          (player) => player.user_id._id === currentPlayerId
        );

        const response = await room.removePlayerFromMatch(
          session?.user.access_token,
          roomInfo?._id
        );

        if (roomInfo) {
          //   const updatedPlayersInMatch = roomInfo.players_in_match.filter(
          //     (player) => {
          //       player.user_id !== session?.user.userId;
          //     }
          //   );

          //   console.log("updatedPlayersInMatch: ", updatedPlayersInMatch)

          //   const nextPlayerIndex = findNextPlayerIndex(updatedPlayersInMatch);
          //   if (nextPlayerIndex !== -1) {
          //     updatedPlayersInMatch[nextPlayerIndex].is_playing = true;
          //   }

          //   setRoomInfo({
          //     ...roomInfo,
          //     players_in_match: updatedPlayersInMatch,
          //   });

          if (
            playerToRemove &&
            currentPlayerId === session?.user.userId &&
            response.players_in_match.length >= 3
          ) {
            setIsPlayerLost(true);
            setIsLoseModalVisible(true);
            setCountdown(0);
          }

          if (response.players_in_match.length < 2) {
            setLeaderboard(response.leaderboard);
            setIsPlayerLost(true);
            setIsLeaderboardVisible(true);
          }
        }
      } catch (error) {
        console.error("Error removing player:", error);
      }
    }
  };

  const findNextPlayerIndex = (players: PlayerInMatchType[]) => {
    const currentPlayerIndex = players.findIndex((player) => player.is_playing);
    return currentPlayerIndex === players.length - 1
      ? 0
      : currentPlayerIndex + 1;
  };

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

        console.log("response UPDATE TURN: ", response);

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

  const getPlayerInfo = (playerId: string) => {
    return roomInfo?.player_list.find(
      (player) => player.user_id._id === playerId
    );
  };

  const handleLoseModalClose = () => {
    setIsLoseModalVisible(false);
  };

  const handleLeaderboardClose = () => {
    setIsLeaderboardVisible(false);
  };

  useEffect(() => {
    if (!socketContext?.socket || !roomId) return;

    socketContext.socket.on(`room-${roomId}`, (updatedRoom: RoomType) => {
      setRoomInfo(updatedRoom);
      console.log("updatedRoom socket: ", updatedRoom);
    });

    return () => {
      socketContext.socket!.off(`room-${roomId}`);
    };
  }, [socketContext?.socket, roomId]);

  return (
    <div className="mode-container relative container flex justify-between items-center flex-col">
      <div className="absolute left-0 top-10 bg-white p-4 rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-bold">Player Order</h3>
        <div className="space-y-4">
          {roomInfo?.players_in_match
            .sort((a, b) => a.no - b.no)
            .map((player: PlayerInMatchType, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3"
                >
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

      {/* leaderboard */}
      <Modal
        title={
          <div className="text-center text-2xl text-yellow-500">
            Final Results!
          </div>
        }
        open={isLeaderboardVisible}
        onCancel={handleLeaderboardClose}
        footer={null}
        centered
      >
        <div className="text-center py-6">
          <CiTrophy className="text-6xl text-yellow-500 mb-4" />
          <div className="whitespace-pre-line">{leaderboard}</div>
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
