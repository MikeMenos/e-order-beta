import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface CartPricingIteline {
  LINENUM: string;
  MTRL: string;
  MTRL_ITEM_CODE?: string;
  MTRL_ITEM_NAME?: string;
  QTY2: string;
  LINEVAL: string;
  SXPERC: string;
}

export interface CartPricingSaldoc {
  TRDR: string;
  SERIES: string;
  PAYMENT: string;
  SUMAMNT: string;
}

export interface CartPricingData {
  SALDOC: CartPricingSaldoc[];
  ITELINES: CartPricingIteline[];
}

export interface CartPricingResponse {
  success: boolean;
  readOnly?: boolean;
  data: CartPricingData;
  prtname?: string;
  caption?: string;
  calc?: boolean;
  einvoice?: boolean;
  remoteKey?: string;
}

export function useGetCartPricing({
  basketId,
  enabled,
}: {
  basketId: string | undefined;
  enabled: boolean;
}) {
  return useQuery<CartPricingResponse, Error>({
    queryKey: ["cart-pricing", basketId],
    enabled: Boolean(enabled && basketId),
    queryFn: async () => {
      const { data } = await api.post<CartPricingResponse>("/get-cart-pricing", {
        KEY: basketId,
      });
      return data;
    },
  });
}
