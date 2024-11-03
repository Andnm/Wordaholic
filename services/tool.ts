import { BuyItem, BuyStamina } from "@models/tool";
import { LoginResponse } from "@models/user";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const getAllTool = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.tool.getAllTool}`,
    token: token,
  });
  return response.data;
};

const useHint = async (token: string, room_id: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.tool.useHint}/${room_id}`,
    token: token,
  });
  return response.data;
};

const buyItem = async (token: string, model: BuyItem): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.tool.buyItem}`,
    token: token,
    data: model,
  });
  return response.data;
};

const buyStamina = async (token: string, model: BuyStamina): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.tool.buyStamina}`,
    token: token,
    data: model,
  });
  return response.data;
};

const tool = { getAllTool, useHint, buyItem, buyStamina };

export default tool;
