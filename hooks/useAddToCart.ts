import { api } from "@/lib/api";
import { AddToCartPayload } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function postCart(payload: AddToCartPayload) {
  const { data } = await api.post("/add-to-cart", payload);
  return data;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { setBasketId } = appStore();

  return useMutation<{ success: string; id: string }, Error, AddToCartPayload>({
    mutationFn: (payload: AddToCartPayload) => postCart(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setBasketId(data.id);
    },
  });
}
