import { create } from "zustand";

type Store = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userId: number | null;
  setUserId: (userId: number) => void;
};

export const useAuth = create<Store>()((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  userId: null,
  setUserId: (userId) => set({ userId }),
}));
