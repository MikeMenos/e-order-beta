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
  const currentBranch = appStore((s) => s.currentBranch);

  const effectiveTrdr = trdr ?? currentBranch?.TRDR;
  const effectiveBranch = branch ?? currentBranch?.BRANCH;

  return useQuery<ICart, Error>({
    queryKey: ["cart", effectiveTrdr, effectiveBranch],
    enabled: Boolean(effectiveTrdr && effectiveBranch),
    queryFn: async () => {
      const { data } = await api.post("/get-cart", {
        trdr: effectiveTrdr,
        branch: effectiveBranch,
      });
      return data;
    },
  });
}
