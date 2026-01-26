import { errorToast } from "@/components/toasts";
import { api } from "@/lib/api";
import { AddToCartPayload, CartResponse } from "@/lib/interfaces";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** Fake add (MTRL 2924, QTY 0.1) to create a basket; returns new basket id. */
export async function getFirstBasketKey(params: {
  trdr: number;
  branch: number;
}): Promise<string | undefined> {
  const payload = buildFirstBasketKeyPayload(params);
  const { data } = await api.post<CartResponse>("/add-to-cart", payload);
  if (data && (data as { success?: boolean }).success === false) {
    throw new Error((data as { error?: string }).error);
  }
  return (data as { id?: string })?.id;
}

export async function postCart(
  payload: AddToCartPayload,
): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>("/add-to-cart", payload);

  if (data && (data as { success?: boolean }).success === false) {
    throw new Error((data as { error?: string }).error);
  }

  return data as CartResponse;
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, AddToCartPayload>({
    mutationFn: postCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      errorToast(error?.message || "Σφάλμα");
    },
  });
}
