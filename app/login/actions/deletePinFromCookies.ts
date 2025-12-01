"use server";

import { cookies } from "next/headers";

export async function deletePinFromCookies() {
  (await cookies()).delete("ergastirio-session-key");
}
