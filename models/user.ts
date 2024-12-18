import { Base, PagingModel } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expiresIn: number;
  userName: string;
  email: string;
  phoneNumber?: string;
  currenNoticeCount: number;
  roles: string[];
}

export interface User extends Base {
  id: string;
  phoneNumber?: string;
  userName?: string;
  fullname?: string;
  email?: string;
  address?: string;
  currenNoticeCount: number;
  roles?: string[];
  role?: string;
  name: string;
  star?: number;
  priority?: number;
  avatar?: string;
  gender?: string;
  dob?: string;
  isPublicGender?: boolean;
  isActive?: boolean;
}

export interface UserData extends PagingModel {
  data: User[];
}

export interface UserId {
  userId: string;
}