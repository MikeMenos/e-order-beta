import { errorToast } from "@/components/toasts";
import { api } from "@/lib/api";
import { AddToCartPayload } from "@/lib/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CartErrorResponse = {
  success: false;
  errorcode: number;
  error: string;
};

export async function postCart(payload: AddToCartPayload): Promise<void> {
  const { data } = await api.post<CartErrorResponse | undefined>(
    "/add-to-cart",
    payload
  );

  if (data && data.success === false) {
    throw new Error(data.error);
  }
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddToCartPayload>({
    mutationFn: postCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });
}
