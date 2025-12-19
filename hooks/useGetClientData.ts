import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { appStore } from "@/stores/appStore";
import type { ClientResponse } from "@/lib/interfaces";

export function useGetClientData() {
  const currentBranch = appStore((s) => s.currentBranch);
  const setCurrentBranch = appStore((s) => s.setCurrentBranch);

  return useMutation<ClientResponse, Error, string>({
    mutationFn: async (AFM: string) => {
      const { data } = await api.post("/get-client-data", { AFM });
      return data;
    },
    onSuccess: (data) => {
      if (!currentBranch?.BRANCH) return;

      const newBranch = data.data.find(
        (item) => item.BRANCH === currentBranch?.BRANCH
      );

      setCurrentBranch(newBranch);
    },
  });
}
