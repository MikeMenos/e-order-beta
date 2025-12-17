import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import iconv from "iconv-lite";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const q = typeof body?.q === "string" ? body.q.trim() : "";

  const clientID = process.env.CLIENT_ID;

  const payload: Record<string, any> = { clientID };

  if (q) {
    if (/^\d+$/.test(q)) payload.AFM = q;
    else payload.NAME = q;
  }

  const response = await backend.post(
    "/s1services/js/api.web/PELATES_ALL",
    payload,
    { responseType: "arraybuffer" }
  );

  const text = iconv.decode(Buffer.from(response.data), "win1253");
  const data = JSON.parse(text);

  return NextResponse.json(data);
}
