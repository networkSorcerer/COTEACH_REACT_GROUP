import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useDiaryStore = create(
  persist(
    (set, get) => ({
      diaries: [],
      selectedDate: new Date(), // 기본값으로 오늘 날짜
      setSelectedDate: (date) => set({ selectedDate: date }),

      addDiary: ({ title, mood, content }) => {
        const id = Date.now().toString(36);
        const createdAt = new Date().toISOString();
        const entry = { id, title, mood, content, createdAt, analysis: null };
        set((state) => ({ diaries: [entry, ...state.diaries] }));
        return id;
      },

      //diaries 순회하면서 새로운 배열을 만든다. 매개변수로 받아온 id와 현재 id(d.id)같은 요소가 있으면 해당 객체의 모든 속성(...d)을 펼쳐서 payload값들로 덮어씌운다. id가 같지 않으면 그대로 유지
      updateDiary: (id, payload) =>
        set((state) => ({
          diaries: state.diaries.map((d) =>
            d.id === id ? { ...d, ...payload } : d
          ),
        })),

      getDiary: (id) => get().diaries.find((d) => d.id === id) || null,

      listDiaries: () =>
        [...get().diaries].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
    }),
    {
      name: "diary-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        diaries: state.diaries,
        selectedDate: state.selectedDate,
      }),
    }
  )
);

export default useDiaryStore;
