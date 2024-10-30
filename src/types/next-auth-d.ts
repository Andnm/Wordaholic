import NextAuth, { DefaultSession } from "next-auth";
import { DataNode as AntdDataNode } from "antd/es/tree";

declare module "next-auth" {
  interface Session {
    expires: Date;
    user: {
      access_token: string;
      tokenType: string;
      userId: string;
      expiresIn: number;
      userName: string;
      currenNoticeCount: number;
      roles: string[];
    } & DefaultSession["user"];
  }

  interface DefaultUser {
    access_token: string;
    tokenType: string;
    userId: string;
    expiresIn: number;
    userName: string;
    loginDate: string;
    currenNoticeCount: number;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface DefaultJWT extends Record<string, unknown> {
    access_token: string;
    tokenType: string;
    userId: string;
    expiresIn: number;
    userName: string;
    loginDate: string;
    currenNoticeCount: number;
    roles: string[];
  }
}

export interface DataNode extends AntdDataNode {
  id?: string;
  title: string;
  key: string;
  name?: string;
  isLeaf?: boolean;
  parentId?: string;
  dateCreated?: string;
  dataUpdated?: string;
  children: DataNode[] | undefined;
  label?: string;
}
