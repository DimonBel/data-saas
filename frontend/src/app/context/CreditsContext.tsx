"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import UserService from "@/services/user.service";
import { useSession } from "next-auth/react";

interface CreditsContextType {
  credits: number | null;
  updateCredits: (newCredits: number) => void;
  fetchCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  // Function to fetch credits from the backend
  const fetchCredits = async () => {
    if (session?.user?.email) {
      try {
        const fetchedCredits = await UserService.getUserCreditsByEmail(session.user.email);
        setCredits(fetchedCredits);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    }
  };

  // Function to update credits locally and trigger re-fetch
  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
    fetchCredits();  // Ensures the updated value is reflected after an API update
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchCredits();

      // Polling mechanism to auto-refresh credits every 60 seconds
      const interval = setInterval(() => {
        fetchCredits();
      }, 60000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [session]);

  return (
    <CreditsContext.Provider value={{ credits, updateCredits, fetchCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};
