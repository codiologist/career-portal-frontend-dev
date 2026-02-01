/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import api from "@/lib/axiosInstance";
import { TGetMyProfileResponse } from "@/types/profile.types";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AuthContextType {
  user: TGetMyProfileResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<any>;
  refetchUser: () => Promise<void>;
  logout: () => void;

  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TGetMyProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in on mount
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me", { withCredentials: true });
      // console.log("context", res.data);
      setUser(res.data as TGetMyProfileResponse);
    } catch {
      // User not authenticated - this is expected when not logged in
    } finally {
      setLoading(false);
    }
  };

  // run once on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );

    return res.data;
  };

  // Login function
  const signup = async (
    fullName: string,
    email: string,
    phone: string,
    password: string,
  ) => {
    try {
      const res = await api.post(
        "/auth/register",
        { fullName, email, phone, password },
        { withCredentials: true },
      );
      console.log(res);
      // setUser(res.data.data);
      return res.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // Logout function
  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        isAuthenticated,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
