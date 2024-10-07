"use client";

import React, { useState } from "react";
import { Layout, Typography, Button, Avatar, Flex } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { login, logout } from '../../services/authService';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <Layout className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header className="bg-gray-800 py-4 px-8 flex justify-between items-center">
        <Link href="/">
          <Title level={3} className="text-white">CyberWhale</Title>
        </Link>
        <div>
          {status === "unauthenticated" ? (
            <Flex>
              <Button
                type="text"
                style={{
                  backgroundColor: "#D6B0FF",
                  borderColor: "#D6B0FF",
                  color: "black",
                }}
                onClick={() => login("google")}
              >
                Log In
              </Button>
            </Flex>
          ) : (
            <>
              <Link href="/profile">
                <Avatar
                  src={session?.user?.image}
                  size="large"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
              </Link>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#D6B0FF",
                  borderColor: "#D6B0FF",
                  color: "black",
                }}
                onClick={() => logout()}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </Header>
      <Content className="flex-grow container mx-auto py-10 px-6 flex justify-center items-center">
        {children}
      </Content>
      <Footer className="bg-gray-800 py-4 px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} CyberWhale. All rights reserved.</p>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
