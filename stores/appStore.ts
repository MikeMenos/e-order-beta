import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  branchNumber?: string;
  setBranchNumber: (value?: string) => void;
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
      branchNumber: undefined,
      setBranchNumber: (branchNumber) => set({ branchNumber }),
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
