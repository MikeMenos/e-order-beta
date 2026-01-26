"use server";

import { cookies } from "next/headers";

export async function setPinToCookies(pin: string, afm?: string) {
  const cookieStore = await cookies();
  
  // For special AFM values, set a special cookie
  if (afm === "999999999" || afm === "987654321") {
    cookieStore.set("ergastirio-special-session", afm, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } else {
    // Regular session cookie
    cookieStore.set("ergastirio-session-key", pin, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}
