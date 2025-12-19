import { ClientResponse } from "@/lib/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  currentBranch?: ClientResponse["data"][number];
  setCurrentBranch: (branch?: ClientResponse["data"][number]) => void;

  vat?: string;
  setVat: (value?: string) => void;

  basketId?: string;
  setBasketId: (value?: string) => void;

  hydrated: boolean;
  setHydrated: () => void;
};

export const appStore = create<AppState>()(
  persist(
    (set) => ({
      currentBranch: undefined,
      setCurrentBranch: (currentBranch) => set({ currentBranch }),

      vat: undefined,
      setVat: (vat) => set({ vat }),

      basketId: undefined,
      setBasketId: (basketId) => set({ basketId }),

      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "app-storage",
      skipHydration: true,
    }
  )
);
