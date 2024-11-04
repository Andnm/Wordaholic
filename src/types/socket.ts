import { Socket } from "socket.io-client";

export interface Room {
  id: string;
  name: string;
}

export interface SocketContextType {
  socket: Socket<any, any> | null;
  listRooms: any;
  isConnected: boolean;
  refreshRooms: () => void;
}
