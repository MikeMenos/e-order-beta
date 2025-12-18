import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { appStore } from "@/stores/appStore";
import type { ClientResponse } from "@/lib/interfaces";

export function useGetClientData() {
  const branchNumber = appStore((s) => s.branchNumber);
  const setCurrentBranch = appStore((s) => s.setCurrentBranch);

  return useMutation<ClientResponse, Error, string>({
    mutationFn: async (AFM: string) => {
      const { data } = await api.post("/get-client-data", { AFM });
      return data;
    },
    onSuccess: (data) => {
      if (!branchNumber) return;

      const currentBranch = data.data.find(
        (item) => item.BRANCH === branchNumber
      );

      setCurrentBranch(currentBranch);
    },
  });
}
