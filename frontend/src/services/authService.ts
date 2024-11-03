import { signIn, signOut } from "next-auth/react";

export const login = (provider: string) => {
  signIn(provider);
};

export const logout = () => {
  signOut();
};
