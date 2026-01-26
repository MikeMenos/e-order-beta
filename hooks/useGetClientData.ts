import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { appStore } from "@/stores/appStore";
import type { ClientResponse } from "@/lib/interfaces";

export function useGetClientData(isSpecialAfm?: boolean) {
  const currentBranch = appStore((s) => s.currentBranch);
  const setCurrentBranch = appStore((s) => s.setCurrentBranch);

  return useMutation<ClientResponse | null, Error, string>({
    mutationFn: async (AFM: string) => {
      if (isSpecialAfm) {
        return null;
      }

      const { data } = await api.post("/get-client-data", { AFM });
      return data;
    },
    onSuccess: (data) => {
      if (!data || data.data.length === 0) return;

      const newBranch = data.data.find(
        (item) => item.BRANCH === currentBranch?.BRANCH
      );

      setCurrentBranch(newBranch);
    },
  });
}