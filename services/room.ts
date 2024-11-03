import {
  BaseRoom,
  CreateRoomModel,
  ParamJoinRoom,
  ParamKickPlayer,
  ParamLeaveRoom,
  UpdatePlayerTurn,
  UpdatePlayBotTurn,
} from "@models/room";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

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

const joinRoom = async (token: string, params: ParamJoinRoom): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.joinRoom}`,
    token: token,
    params: params,
  });
  return response.data;
};

const leaveRoom = async (
  token: string,
  params: ParamLeaveRoom
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.joinRoom}`,
    token: token,
    params: params,
  });
  return response.data;
};

const kickPlayer = async (
  token: string,
  params: ParamKickPlayer
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.kickPlayer}`,
    token: token,
    params: params,
  });
  return response.data;
};

const changeReadyStatus = async (
  token: string,
  params: BaseRoom
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.changeReadyStatus}`,
    token: token,
    params: params,
  });
  return response.data;
};

const startGame = async (token: string, params: BaseRoom): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.room.startGame}`,
    token: token,
    params: params,
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

const room = {
  createRoom,
  joinRoom,
  leaveRoom,
  kickPlayer,
  changeReadyStatus,
  startGame,
  playTurnWithPlayer,
  startWithBot,
  playTurnWithBot,
};

export default room;