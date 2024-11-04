import { ParamGet, ParamGetWithId } from "@models/base";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  CustomerData,
  CusParam,
  ChangePassword,
  RegisterType,
} from "@models/customer";
import { LoginResponse } from "@models/user";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const createAccount = async (model: RegisterType): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.customer.register}`,
    data: model,
  });
  return response.data;
};

const getUserById = async (token: string, user_id: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.customer.getUserById}/${user_id}`,
    token: token,
  });
  return response.data;
};

const getProfileCustomer = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.customer.getProfile}`,
    token: token,
  });
  return response.data;
};

const loginWithGoogle = async (token: string): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.customer.loginWithGoogle}`,
    data: {
      token: token,
    },
  });
  return response.data;
};

const loginWithCustomerEmail = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await httpClient.post({
    url: apiLinks.customer.loginWithCustomerEmail,
    data: {
      email: email,
      password: password,
    },
  });
  return response.data;
};

const customer = {
  createAccount,
  getUserById,
  getProfileCustomer,
  loginWithGoogle,
  loginWithCustomerEmail,
};

export default customer;
