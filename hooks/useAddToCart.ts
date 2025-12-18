import { errorToast } from "@/components/toasts";
import { api } from "@/lib/api";
import { AddToCartPayload, CartResponse } from "@/lib/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function postCart(
  payload: AddToCartPayload
): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>("/add-to-cart", payload);
  console.log(data);
  if (data && data?.success === false) {
    throw new Error(data.error);
  }

  return data;
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, AddToCartPayload>({
    mutationFn: postCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.log(error);
      errorToast(error.message);
    },
  });
}
