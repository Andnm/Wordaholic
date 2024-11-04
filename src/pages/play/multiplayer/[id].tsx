import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import HeaderBack from "@layout/components/header/HeaderBack";
import HomeLayout from "@layout/HomeLayout";
import room from "@services/room";
import { Avatar, Button, Descriptions, Divider, Modal, Spin } from "antd";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaCoins, FaKey, FaLock, FaUsers } from "react-icons/fa";
import { CiUnlock, CiLock, CiTrophy } from "react-icons/ci";
import customer from "@services/customer";
import { generateFallbackAvatar } from "@utils/helpers";
import { MdQrCode2 } from "react-icons/md";
import { PlayerType, RoomType, UserType } from "@models/room";
import { toastError } from "@utils/global";
import { SocketContext } from "@/pages/_app";
import MultiplayerScreen from "@components/playComponent/MultiplayerScreen";
import { decreaseStaminas } from "@slices/player";
import LeaderboardModal from "@components/playComponent/LeaderboardModal";

const RoomPage = () => {
  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const socketContext = useContext(SocketContext);

  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [hasLeaderboardBeenShown, setHasLeaderboardBeenShown] = useState(false);

  useEffect(() => {
    if (pathName) {
      const parts = pathName.split("/");
      const id = parts[parts.length - 1];
      setRoomId(id);
    }
  }, [pathName]);

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

  const handleLeaveRoom = async () => {
    if (roomInfo && session?.user.access_token) {
      try {
        await room.leaveRoom(session.user.access_token, roomInfo._id);

        router.push("/play/multiplayer");
      } catch (error) {
        console.error("Failed to leave room:", error);
      }
    } else {
      console.warn("No room information or access token available.");
    }
  };

  const handleChangeReadyStatus = async () => {
    if (roomInfo && session?.user.access_token) {
      try {
        setIsActionLoading(true);
        const response = await room.changeReadyStatus(
          session.user.access_token,
          roomInfo._id
        );

        console.log("response status: ", response);

        setRoomInfo((prevRoomInfo: any) => {
          const updatedPlayerList = prevRoomInfo?.player_list.map((player) => {
            if (player.user_id._id === session.user.userId) {
              return { ...player, is_ready: !player.is_ready };
            }
            return player;
          });

          return {
            ...prevRoomInfo,
            player_list: updatedPlayerList,
          };
        });
      } catch (error) {
        toastError(error);
        console.error("Failed to change ready status:", error);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleStartGame = async () => {
    if (roomInfo && session?.user.access_token) {
      try {
        setIsActionLoading(true);

        const response = await room.startGame(
          session.user.access_token,
          roomInfo._id
        );

        dispatch(decreaseStaminas(5));
        setHasLeaderboardBeenShown(false);
      } catch (error) {
        toastError(error);
        console.error("Failed to start:", error);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (session?.user.access_token && roomId) {
        setIsLoading(true);

        try {
          const responseGetRoomInfo = await room.getRoomById(
            session?.user.access_token,
            roomId
          );
          console.log("responseGetRoomInfo: ", responseGetRoomInfo);
          setRoomInfo(responseGetRoomInfo);
        } catch (error) {
          toastError(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRoomInfo();
  }, [session?.user.access_token, roomId]);

  //leaderboard
  const handleLeaderboardClose = () => {
    setIsLeaderboardVisible(false);
  };

  useEffect(() => {
    if (
      roomInfo?.leaderboard &&
      roomInfo.leaderboard.length > 0 &&
      roomInfo.players_in_match.length === 0 &&
      !hasLeaderboardBeenShown
    ) {
      setIsLeaderboardVisible(true);
      setHasLeaderboardBeenShown(true);
    }
  }, [roomInfo?.leaderboard, hasLeaderboardBeenShown]);

  return (
    <HomeLayout
      content={
        <div className="mode-container flex justify-start items-center flex-col">
          {roomInfo && (
            <HeaderBack
              namePage={
                <div className="flex items-center justify-center gap-4">
                  Room
                  {roomInfo?.is_private ? (
                    <CiLock className="w-5 h-5" />
                  ) : (
                    <CiUnlock className="w-5 h-5" />
                  )}
                </div>
              }
              link="/play/multiplayer"
              actionLeaveRoom={handleLeaveRoom}
            />
          )}

          {!roomInfo?.is_playing ? (
            <>
              {" "}
              <div
                className="container bg-white shadow-md rounded-lg"
                style={{ margin: "20px 0px 20px 0px" }}
              >
                <Descriptions bordered>
                  <Descriptions.Item
                    label={
                      <div className="flex items-center gap-4">
                        <img
                          src={"../../images/star.png"}
                          alt="coins"
                          className="w-8 h-8"
                        />
                        Coin per Person
                      </div>
                    }
                  >
                    <p className="text-xl font-semibold">
                      {roomInfo?.coin_per_person}
                    </p>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div className="flex items-center gap-4">
                        <MdQrCode2 className="w-4 h-4" /> Invite Code
                      </div>
                    }
                  >
                    {roomInfo?.invite_code}
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <div className="flex items-center gap-4">
                        <FaUsers className="w-5 h-5" /> Current Players
                      </div>
                    }
                  >
                    {roomInfo?.player_list.length} / {roomInfo?.max_players}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center w-full">
                  <Spin />
                </div>
              ) : (
                <div className="list-player grid grid-cols-2 container gap-7 ">
                  {roomInfo?.player_list.map((player: PlayerType, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-md rounded-lg p-5 relative flex items-center justify-between"
                    >
                      <div className=" flex items-center justify-center">
                        <Avatar
                          src={
                            player.user_id.avatar ||
                            generateFallbackAvatar(player.user_id.email)
                          }
                          alt={player.user_id.fullname}
                          style={{
                            marginRight: "15px",
                            border: "1px solid #d9d9d9",
                          }}
                          size={55}
                        />
                        <div>
                          <p className="text-lg font-bold">
                            {player.user_id.fullname || player.user_id.email}
                          </p>
                          {/* <p className="text-base">free</p> */}
                        </div>{" "}
                      </div>

                      <div>
                        <p
                          className={`font-semibold ${
                            player.is_ready ? "text-green-500" : "text-gray-500"
                          }`}
                        >
                          {player.is_ready ? "Ready" : "Not Ready"}
                        </p>
                      </div>

                      {roomInfo?.host_id._id === player.user_id._id && (
                        <FaKey className="text-green-500 ml-2 absolute right-5 top-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full flex justify-center">
                {roomInfo?.host_id._id === session?.user?.userId ? (
                  <button
                    className={`my-5 btn-action-login-register text-center text-xl cursor-pointer max-w-xs`}
                    onClick={handleStartGame}
                  >
                    {!isActionLoading ? "Start Game" : "Loading ..."}
                  </button>
                ) : roomInfo?.player_list.some(
                    (player) => player.user_id._id === session?.user?.userId
                  ) &&
                  roomInfo.player_list.find(
                    (player) => player.user_id._id === session?.user?.userId
                  )?.is_ready === true ? (
                  <button
                    style={{
                      backgroundColor: !isActionLoading
                        ? "lightgray"
                        : "initial",
                    }}
                    className={`my-5 btn-action-login-register text-center text-xl cursor-pointer max-w-xs`}
                    onClick={handleChangeReadyStatus}
                  >
                    {!isActionLoading ? "Cancel" : "Loading ..."}
                  </button>
                ) : (
                  <button
                    className={`my-5 btn-action-login-register text-center text-xl cursor-pointer max-w-xs`}
                    onClick={handleChangeReadyStatus}
                  >
                    {!isActionLoading ? "Ready" : "Loading ..."}
                  </button>
                )}
              </div>
            </>
          ) : (
            <MultiplayerScreen
              roomInfo={roomInfo}
              setRoomInfo={setRoomInfo}
              roomId={roomId}
            />
          )}

          {/* leaderboard */}
          <LeaderboardModal
            isVisible={isLeaderboardVisible}
            onClose={handleLeaderboardClose}
            leaderboard={roomInfo?.leaderboard}
            playerList={roomInfo?.player_list}
          />
        </div>
      }
    />
  );
};

export default RoomPage;
