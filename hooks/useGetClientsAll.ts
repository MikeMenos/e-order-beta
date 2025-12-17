import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ClientResponse } from "@/lib/interfaces";

export function useGetClientsAll() {
    return useQuery<ClientResponse>({
        queryKey: ["clients-all"],
        queryFn: async () => {
            const { data } = await api.post("/get-clients-all", {});
            return data;
        },
    });
}
