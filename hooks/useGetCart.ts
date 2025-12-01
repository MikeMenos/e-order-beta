import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ICart } from "@/lib/interfaces";

export function useGetCart({
  trdr,
  branch,
}: {
  trdr?: string;
  branch?: string;
}) {
  return useQuery<ICart, Error>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.post("/get-cart", { trdr, branch });
      return data;
    },
    enabled: Boolean(trdr && branch),
    staleTime: 0,
  });
}
