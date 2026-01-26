import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.delete("ergastirio-session-key");
  res.cookies.delete("ergastirio-special-session");

  return res;
}
