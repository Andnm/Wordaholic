import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import HeaderBack from "@layout/components/header/HeaderBack";
import HomeLayout from "@layout/HomeLayout";
import room from "@services/room";
import { removeRoomById } from "@slices/room";
import { Avatar, Descriptions, Divider, Spin } from "antd";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCoins, FaKey, FaLock, FaUsers } from "react-icons/fa";
import { CiUnlock, CiLock } from "react-icons/ci";
import customer from "@services/customer";
import { generateFallbackAvatar } from "@utils/helpers";
import { MdQrCode2 } from "react-icons/md";

const RoomPage = () => {
  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [playersInfo, setPlayersInfo] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const listRooms = useSelector((state) => state.room.listRooms);

  console.log("listRooms: ", listRooms);

  useEffect(() => {
    if (pathName) {
      const parts = pathName.split("/");
      const id = parts[parts.length - 1];
      setRoomId(id);
    }
  }, [pathName]);

  const roomInfo = listRooms?.find((room) => room._id === roomId);

  const handleLeaveRoom = async () => {
    if (roomInfo && session?.user.access_token) {
      try {
        await room.leaveRoom(session.user.access_token, roomInfo._id);

        dispatch(removeRoomById(roomInfo._id));

        router.push("/play/multiplayer");
        console.log("Left room successfully");
      } catch (error) {
        console.error("Failed to leave room:", error);
      }
    } else {
      console.warn("No room information or access token available.");
    }
  };

  useEffect(() => {
    const fetchPlayersInfo = async () => {
      if (
        roomInfo &&
        roomInfo.player_list.length > 0 &&
        session?.user.access_token
      ) {
        const playersData = await Promise.all(
          roomInfo.player_list.map(async (player) => {
            const user = await customer.getUserById(
              session?.user.access_token,
              player.user_id
            );
            return user;
          })
        );
        setPlayersInfo(playersData);
      }
      setLoading(false);
    };

    fetchPlayersInfo();
  }, [roomInfo]);

  return (
    <HomeLayout
      content={
        <div className="mode-container flex justify-between items-center flex-col">
          {/* tạm thời ẩn, khi nào có api thì sửa sau*/}

          {/* <HeaderBack
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
          /> */}

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
                {roomInfo?.coin_per_person}
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
                {roomInfo?.players_in_match.length} / {roomInfo?.max_players}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div className="list-player grid grid-cols-2 container gap-7 ">
            {loading ? (
              <Spin />
            ) : (
              playersInfo.map((player) => (
                <div
                  key={player._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="bg-white shadow-md rounded-lg p-5 relative"
                >
                  <Avatar
                    src={player.avatar || generateFallbackAvatar(player.email)}
                    alt={player.fullname}
                    style={{ marginRight: "15px", border: "1px solid #d9d9d9" }}
                    size={55}
                  />
                  <div>
                    <p className="text-lg font-bold">
                      {player.fullname || player.email}
                    </p>
                    {/* <p className="text-base">free</p> */}
                  </div>

                  {roomInfo?.host_id === player._id && (
                    <FaKey className="text-green-500 ml-2 absolute right-5 top-5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="w-full flex justify-center">
            {playersInfo.map((player) => (
              <button
                key={player._id} 
                className={`my-5 btn-action-login-register text-center text-xl cursor-pointer max-w-xs`}
              >
                {roomInfo?.host_id === player._id ? "Start Game" : "Ready"}
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
};

export default RoomPage;
