"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";
import HeaderAuthen from "./components/header/HeaderAuthen";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const HomeLayout: React.FC<Props> = (props) => {
  const { content } = props;
  
  return (
    <div className="min-h-screen">
      <HeaderAuthen />
      {content}
    </div>
  );
};

export default HomeLayout;
