import { create } from "zustand";

export const useSearchKeyword = create((set) => ({
  searchKeyword: "",
  setSearchKeyword: (value) => set(() => ({ searchKeyword: value })),
}));
