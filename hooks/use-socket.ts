import { urlServerSide } from "@utils/api-links";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket;

export const useSocket = () => {
  const [listRooms, setListRooms] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket = io(`${urlServerSide}` || "http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
      // console.log("socket connected!");
      socket.emit("get_list_rooms");
    });

    socket.on("list_rooms", (rooms) => {
      // console.log("rooms: ",rooms)
      setListRooms(rooms);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const refreshRooms = () => {
    if (socket) {
      socket.emit("get_rooms");
    }
  };

  return {
    socket,
    listRooms,
    isConnected,
    refreshRooms,
  };
};
