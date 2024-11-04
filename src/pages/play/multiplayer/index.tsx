import { SocketContext } from "@/pages/_app";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import HeaderBack from "@layout/components/header/HeaderBack";
import HomeLayout from "@layout/HomeLayout";
import { RoomType } from "@models/room";
import customer from "@services/customer";
import room from "@services/room";
import { toastError } from "@utils/global";
import { generateFallbackAvatar } from "@utils/helpers";
import {
  Avatar,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Spin,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { CiLock, CiUnlock } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";

const Multiplayer = () => {
  const { listRooms, isConnected, refreshRooms }: any =
    useContext(SocketContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  const router = useRouter();
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const handleCreateClick = () => {
    setIsModalVisible(true);
  };

  const handleCreateOk = async () => {
    const values = await form.validateFields();

    if (session?.user.access_token) {
      setIsLoadingCreate(true);
      try {
        const responseCreateRoom = await room.createRoom(
          session?.user.access_token,
          {
            max_players: values.max_players,
            is_private: values.is_private,
            coin_per_person: values.coin_per_person,
          }
        );

        router.push(`/play/multiplayer/${responseCreateRoom._id}`);
      } catch (error) {
        console.error("Failed to create room:", error);
      } finally {
        setIsLoadingCreate(false);
        setIsModalVisible(false);
      }
    }
  };

  const handleJoinRoomPrivate = async () => {
    if (!inviteCode) {
      toastError("Please enter an invite code.");
      return;
    }
    if (session?.user.access_token) {
      try {
        const response = await room.joinRoom(
          session.user.access_token,
          selectedRoomId,
          inviteCode
        );

        console.log("response: ", response);
        router.push(`/play/multiplayer/${selectedRoomId}`);
      } catch (error) {
        toastError("Failed to join room. Please check your invite code.");
        toastError(error);
        console.error("Failed to join room:", error);
      } finally {
        setInviteCode("");
        setIsJoinModalVisible(false);
      }
    }
  };

  const handleJoinRoomImmediately = async (roomId: string) => {
    if (session?.user.access_token) {
      try {
        const response = await room.joinRoom(session.user.access_token, roomId);
        router.push(`/play/multiplayer/${roomId}`);
      } catch (error) {
        toastError(error);
        console.error("Failed to join room:", error);
      }
    }
  };

  const handleJoinRoomWithCode = async () => {
    if (session?.user.access_token) {
      setIsLoadingSearch(true);
      try {
        const response = await room.joinRoomWithCode(
          session.user.access_token,
          searchCode
        );

        console.log("response: ", response);
        router.push(`/play/multiplayer/${response._id}`);
      } catch (error) {
        toastError(error);
        console.error("Failed to join room:", error);
      } finally {
        setIsLoadingSearch(false);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode) {
      handleJoinRoomWithCode();
    }
  };

  const handleKeyPressSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJoinRoomPrivate();
    }
  };

  const openJoinModal = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsJoinModalVisible(true);
  };

  return (
    <HomeLayout
      content={
        <div className="mode-container flex justify-start items-center flex-col">
          <HeaderBack namePage="Multiplayer" link="/play" />

          <div className="search-container flex flex-row items-center justify-center gap-7 w-full container">
            <form
              className="form shadow-xl"
              onSubmit={(e) => {
                handleSearch(e);
              }}
            >
              <button className="cursor-pointer">
                <svg
                  width="17"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-labelledby="search"
                >
                  <path
                    d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor"
                    strokeWidth="1.333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <input
                className="input"
                placeholder="Enter invite code"
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyPress={handleKeyPressSearch}
              />
              <button
                className="reset cursor-pointer"
                type="reset"
                onClick={() => {
                  setSearchCode("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </form>

            {isLoadingSearch ? (
              <Spin/>
            ) : (
              <button className="button-create" onClick={handleCreateClick}>
                <span>
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Create
                </span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 container gap-7">
            {listRooms.length === 0 ? (
              <div className="col-span-2 text-center p-5">
                <p className="text-lg font-semibold">
                  Không có room nào tồn tại
                </p>
              </div>
            ) : (
              listRooms.map((room: RoomType, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-5 relative cursor-pointer hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    if (!room?.is_private) {
                      handleJoinRoomImmediately(room._id);
                    } else {
                      openJoinModal(room._id);
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={
                        room.host_id.avatar ||
                        generateFallbackAvatar(room.host_id.email!)
                      }
                      alt="fullname"
                      style={{
                        marginRight: "15px",
                        border: "1px solid #d9d9d9",
                      }}
                      size={55}
                    />
                    <div>
                      <p className="text-lg font-bold">
                        {room.host_id.fullname || room.host_id.email}
                      </p>
                      {/* <p className="text-base">free</p> */}
                    </div>
                  </div>

                  <div className="flex items-center justify-around mt-3">
                    <div>
                      <div className="flex items-center gap-4">
                        <FaUsers className="w-5 h-5" />{" "}
                        <p>
                          {room?.player_list.length} / {room?.max_players}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`font-semibold ${
                        room.is_playing ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {room.is_playing ? "Playing" : "Waiting"}
                    </p>

                    <div
                      className="flex flex-row items-center justify-between relative h-7 w-28 shadow-md rounded-lg"
                      style={{ backgroundColor: "#FEF7E6" }}
                    >
                      <p className="text-center w-full text-lg font-semibold">
                        {room.coin_per_person}
                      </p>
                      <div className="stamina-item absolute -top-1 -right-3 w-9 h-9">
                        <img
                          src={"../../images/star.png"}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>

                  {room?.is_private ? (
                    <CiLock className="w-5 h-5 absolute top-5 right-5" />
                  ) : (
                    <CiUnlock className="w-5 h-5 absolute top-5 right-5" />
                  )}
                </div>
              ))
            )}
          </div>

          <Modal
            title="Create Room"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            {isLoadingCreate ? (
              <div className="flex justify-center items-center w-full">
                <Spin />
              </div>
            ) : (
              <Form form={form} layout="horizontal" onFinish={handleCreateOk}>
                <Form.Item
                  label="Max Players"
                  name="max_players"
                  rules={[
                    { required: true, message: "Please select max players!" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={5}>5</Radio>
                    <Radio value={10}>10</Radio>
                    <Radio value={15}>15</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="is_private" valuePropName="checked">
                  <Checkbox>Private Room</Checkbox>
                </Form.Item>

                <Form.Item
                  label="Coin per Person"
                  name="coin_per_person"
                  rules={[
                    {
                      required: true,
                      message: "Please select coin per person!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={5}>5</Radio>
                    <Radio value={10}>10</Radio>
                    <Radio value={15}>15</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Create Room
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Modal>

          <Modal
            title="Join Room"
            open={isJoinModalVisible}
            onCancel={() => setIsJoinModalVisible(false)}
            footer={null}
          >
            <Form layout="vertical" onFinish={handleJoinRoomPrivate}>
              <Form.Item label="Invite Code" required>
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Confirm
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      }
    />
  );
};

export default Multiplayer;
