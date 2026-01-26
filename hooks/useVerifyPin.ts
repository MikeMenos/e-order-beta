import { setPinToCookies } from "@/app/login/actions/setPInToCookies";
import { useMutation } from "@tanstack/react-query";

export function useVerifyPin() {
  return useMutation({
    mutationFn: async ({ pin, afm }: { pin: string; afm?: string }) => {
      await setPinToCookies(pin, afm);
    },
  });
}
