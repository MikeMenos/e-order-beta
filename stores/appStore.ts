import { ClientResponse } from "@/lib/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  clientData?: ClientResponse;
  setClientData: (value: ClientResponse | undefined) => void;
  branchNumber?: string;
  setBranchNumber: (value?: string) => void;
  basketId: string;
  setBasketId: (value: string) => void;
  hydrated: boolean;
  setHydrated: () => void;
};

export const appStore = create<AppState>()(
  persist(
    (set) => ({
      clientData: undefined,
      setClientData: (clientData) => set({ clientData }),
      branchNumber: undefined,
      setBranchNumber: (branchNumber) => set({ branchNumber }),
      basketId: "",
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
