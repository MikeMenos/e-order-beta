import { setPinToCookies } from "@/app/login/actions/setPInToCookies";
import { useMutation } from "@tanstack/react-query";

export function useVerifyPin() {
  return useMutation({
    mutationFn: async (pin: string) => {
      await setPinToCookies(pin);
    },
  });
}
