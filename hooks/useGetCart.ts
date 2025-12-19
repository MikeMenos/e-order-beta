import { buildFirstBasketKeyPayload } from "./../lib/utils";
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
  const { basketId } = appStore();
  console.log(basketId);
  return useQuery<ICart, Error>({
    queryKey: ["cart", branch, basketId],
    queryFn: async () => {
      const { data } = await api.post("/get-cart", { trdr, branch });
      return data;
    },
    staleTime: 200,

    enabled: Boolean(trdr && branch),
  });
}
