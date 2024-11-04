import { Socket } from 'socket.io-client';

export interface Room {
  id: string;
  name: string;
}

export interface SocketContextType {
  listRooms: any;
  isConnected: boolean;
  refreshRooms: () => void;
}