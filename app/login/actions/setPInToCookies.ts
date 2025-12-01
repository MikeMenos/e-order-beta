"use server";

import { cookies } from "next/headers";

export async function setPinToCookies(pin: string) {
  (await cookies()).set("ergastirio-session-key", pin, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
