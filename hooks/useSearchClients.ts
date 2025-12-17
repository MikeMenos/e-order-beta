import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { ClientResponse } from "@/lib/interfaces";

export function useSearchClients() {
    return useMutation<ClientResponse, Error, { q: string }>({
        mutationFn: async ({ q }) => {
            const { data } = await api.post("/get-clients-all", { q });
            return data;
        },
    });
}
