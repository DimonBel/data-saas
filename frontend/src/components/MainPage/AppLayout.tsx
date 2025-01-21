"use client";

import React, { useState, useEffect } from "react";
import { Layout, Typography, Button, Avatar, Flex, Spin } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { login, logout } from '../../services/authService';
import UserService from "../../services/user.service"
import { useCredits } from "../../app/context/CreditsContext";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}


const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const { credits, fetchCredits } = useCredits();

  

  useEffect(() => {
    fetchCredits();
  }, [session]);

  return (
    <Layout className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header className="bg-gray-800 py-4 px-8 flex justify-between items-center">
        <Link href="/">
          <Title level={3} className="text-white">Data Enricher</Title>
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
            <Flex align="center">
              <Link href="/profile">
                <Avatar
                  src={session?.user?.image}
                  size="large"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
              </Link>
              <span style={{ marginRight: "15px", fontSize: "16px", color: "#D6B0FF" }}>
                {loading ? <Spin size="small" /> : `Credits: ${credits !== null ? credits : "N/A"}`}
              </span>
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
            </Flex>
          )}
        </div>
      </Header>
      <Content className="flex-grow container mx-auto py-10 px-6 flex justify-center items-center">
        {children}
      </Content>
      <Footer className="bg-gray-800 py-4 px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} PBL Data Enricher. All rights reserved.</p>
      </Footer>
    </Layout>
  );
};

export default AppLayout