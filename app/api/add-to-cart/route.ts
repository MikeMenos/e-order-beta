import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  const payload = await req.json();
  const clientID = process.env.CLIENT_ID;
  const appId = process.env.APP_ID;

  const { data } = await backend.post("/s1services", {
    clientID,
    ...payload,
    appId,
  });

  return NextResponse.json(data);
}
