import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ICart } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";

export function useGetCart({
  trdr,
  branch,
}: {
  trdr?: string;
  branch?: string;
}) {
  const { currentBranch } = appStore();
  console.log(trdr);
  console.log(branch);
  console.log(currentBranch);
  return useQuery<ICart, Error>({
    queryKey: ["cart", branch, currentBranch],
    queryFn: async () => {
      const { data } = await api.post("/get-cart", {
        trdr: trdr ?? currentBranch?.TRDR,
        branch: branch ?? currentBranch?.BRANCH,
      });
      return data;
    },

    enabled: Boolean(trdr && branch),
  });
}
