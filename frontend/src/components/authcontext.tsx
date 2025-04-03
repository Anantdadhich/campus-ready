
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean; 
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();
  
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  }, [router]);
  
  const fetchUser = useCallback(async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true, 
      });
      setUser(response.data);
      return true;
    } catch (error: any) {
      console.error("Error in fetching user", error);
      if (error.response?.status === 401) {
        logout();
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);
  
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          if (isTokenExpired(savedToken)) {
            logout();
          } else {
            setToken(savedToken);
            await fetchUser(savedToken);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    
    initializeAuth();
  }, [fetchUser, logout]);
  
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);
  
  const login = useCallback(async (authToken: string) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);
    return await fetchUser(authToken);
  }, [fetchUser]);
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    console.error("Token parsing error:", error);
    return true;
  }
};