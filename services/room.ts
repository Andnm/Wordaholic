import {
  BaseRoom,
  CreateRoomModel,
  UpdatePlayerTurn,
  UpdatePlayBotTurn,
  ParamInviteCode,
} from "@models/room";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const getAllRoom = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.getAllRoom}`,
    token: token,
  });
  return response.data;
};

const getRoomById = async (token: string, room_id: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.getRoomById}/${room_id}`,
    token: token,
  });
  return response.data;
};

const createRoom = async (
  token: string,
  model: CreateRoomModel
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.room.createRoom}`,
    token: token,
    data: model,
  });
  return response.data;
};

const joinRoom = async (
  token: string,
  room_id: string,
  param: ParamInviteCode
): Promise<any> => {
  const url = `${apiLinks.room.joinRoom}/${room_id}`;

  const response = await httpClient.get({
    url: url,
    token: token,
    params: param,
  });
  return response.data;
};

const joinRoomWithCode = async (
  token: string,
  invite_code?: string
): Promise<any> => {
  const url = `${apiLinks.room.joinRoomWithCode}/${invite_code}`;
  const response = await httpClient.get({
    url: url,
    token: token,
  });
  return response.data;
};

const leaveRoom = async (token: string, room_id: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.leaveRoom}/${room_id}`,
    token: token,
  });
  return response.data;
};

const kickPlayer = async (
  token: string,
  room_id: string,
  user_id: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.kickPlayer}/${room_id}/${user_id}`,
    token: token,
  });
  return response.data;
};

const changeReadyStatus = async (
  token: string,
  room_id: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.changeReadyStatus}/${room_id}`,
    token: token,
  });
  return response.data;
};

const startGame = async (token: string, room_id: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.startGame}/${room_id}`,
    token: token,
  });
  return response.data;
};

const playTurnWithPlayer = async (
  token: string,
  model: UpdatePlayerTurn
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.room.playTurnWithPlayer}`,
    token: token,
    data: model,
  });
  return response.data;
};

const startWithBot = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.startWithBot}`,
    token: token,
  });
  return response.data;
};

const playTurnWithBot = async (
  token: string,
  model: UpdatePlayBotTurn
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.room.playTurnWithBot}`,
    token: token,
    data: model,
  });
  return response.data;
};

const removePlayerFromMatch = async (
  token: string,
  room_id: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.removePlayerFromMatch}/${room_id}`,
    token: token,
  });
  return response.data;
};

const room = {
  getAllRoom,
  getRoomById,
  createRoom,
  joinRoom,
  joinRoomWithCode,
  leaveRoom,
  kickPlayer,
  changeReadyStatus,
  startGame,
  playTurnWithPlayer,
  startWithBot,
  playTurnWithBot,
  removePlayerFromMatch,
};

export default room;
