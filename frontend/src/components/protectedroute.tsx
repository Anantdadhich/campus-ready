"use client";


import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./authcontext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  if (!token) return null;

  return <>{children}</>;
};
