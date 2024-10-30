"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";
import HeaderPage from "./components/header/HeaderPage";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const HomeLayout: React.FC<Props> = (props) => {
  const { content } = props;
  
  return (
    <div className="min-h-screen">
      <HeaderPage />
      {content}
    </div>
  );
};

export default HomeLayout;
