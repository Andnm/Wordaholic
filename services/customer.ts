import { ParamGet, ParamGetWithId } from "@models/base";
import {
  CustomerCreateModel,
  CustomerUpdateModel,
  CustomerData,
  CusParam,
  ChangePassword,
} from "@models/customer";
import {
  LoginResponse,
} from "@models/user";
import apiLinks from "@utils/api-links";
import { ContentTypeEnum } from "@utils/enum";
import httpClient from "@utils/http-client";

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await httpClient.post({
    url: apiLinks.customer.login,
    data: {
      email: email,
      password: password,
    },
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
  login,
  loginWithGoogle,
  loginWithCustomerEmail
};

export default customer;
