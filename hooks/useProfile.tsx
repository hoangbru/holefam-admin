"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetcher, mutation } from "@/utils/fetcher";
import { User } from "@/types/user";

export const useProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const fetchProfile = async () => {
    try {
      const user = await fetcher(`/api/auth/profile`);
      setUser(user);
    } catch {
      console.error("Error fetching profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await mutation("/api/auth/logout");
      setUser(null);
      router.push("/");
    } catch {
      console.error("Error logging out");
    }
  };

  return {
    user,
    logout,
  };
};
