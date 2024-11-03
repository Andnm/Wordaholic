import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import HeaderBack from "@layout/components/header/HeaderBack";
import HomeLayout from "@layout/HomeLayout";
import room from "@services/room";
import { updateListRooms } from "@slices/room";
import { Button, Checkbox, Form, Modal, Radio, Select, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Multiplayer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const existingRooms = useSelector((state) => state.room.listRooms);

  const handleCreateClick = () => {
    setIsModalVisible(true);
  };

  console.log("listRooms: ", existingRooms);


  const handleOk = async () => {
    const values = await form.validateFields();

    if (session?.user.access_token) {
      setIsLoading(true);
      try {
        const responseCreateRoom = await room.createRoom(
          session?.user.access_token,
          {
            max_players: values.max_players,
            is_private: values.is_private,
            coin_per_person: values.coin_per_person,
          }
        );

        console.log("response: ", responseCreateRoom);
        dispatch(updateListRooms([responseCreateRoom]));
        router.push(`/play/multiplayer/${responseCreateRoom._id}`);
      } catch (error) {
        console.error("Failed to create room:", error);
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
      }
    }
  };

  return (
    <HomeLayout
      content={
        <div className="mode-container flex justify-start items-center flex-col">
          <HeaderBack namePage="Multiplayer" link="/play" />

          <div className="search-container flex flex-row items-center justify-center gap-7 w-full container">
            <form className="form shadow-xl">
              <button>
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
              />
              <button className="reset" type="reset">
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
          </div>

          <Modal
            title="Create Room"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            {isLoading ? (
              <Spin />
            ) : (
              <Form form={form} layout="horizontal" onFinish={handleOk}>
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
        </div>
      }
    />
  );
};

export default Multiplayer;
