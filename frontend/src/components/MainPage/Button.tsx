import React from "react";
import { Button, Avatar, Flex } from "antd";
import { useSession } from "next-auth/react";
import { login, logout } from "../../services/authService";


const Button_log = () => {
  const { data: session, status } = useSession();

  return (<div>
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
        <Avatar
          src={session?.user?.image}
          size="large"
          style={{ cursor: "pointer", marginRight: "10px" }}
        />
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
  </div>);
};

export default Button_log;