import { create } from "zustand";

export const useUserStore = create((set) => ({
  userInfo: null,
  setUserInfo: (user) => set({ userInfo: user }),
  clearUserInfo: () => set({ userInfo: null }),

  isLoggedIn: false,
  setIsLoggedIn: (login) => set({ isLoggedIn: login }),

  userName: "",
  setUserName: (name) => set({ userName: name }),
}));

//
