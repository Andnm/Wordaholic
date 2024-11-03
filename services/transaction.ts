import { LoginResponse } from "@models/user";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const createPayOsUrl = async (token: string, amount: number): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.transaction.createPayOsUrl}`,
    token: token,
    data: {
      amount: amount,
    },
  });
  return response.data;
};

const transaction = {
  createPayOsUrl,
};

export default transaction;
