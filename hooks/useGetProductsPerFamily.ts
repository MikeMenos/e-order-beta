import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { IProductItem } from "@/lib/interfaces";

type Params = {
    family?: string;
    trdr?: string;
    branch?: string;
};

export function useGetProductsPerFamily({ family, trdr, branch }: Params) {
    return useQuery<IProductItem[], Error>({
        queryKey: ["products-per-family", family, trdr, branch],
        queryFn: async () => {
            const { data } = await api.post("/get-products-per-family", {
                family,
                trdr,
                branch,
                
            });

            return data.data;
        },

        enabled: Boolean(family && trdr && branch),
    });
}
