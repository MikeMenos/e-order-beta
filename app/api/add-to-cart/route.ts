import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import iconv from "iconv-lite";

export async function POST(req: Request) {
  const payload = await req.json();
  const clientID = process.env.CLIENT_ID;
  const appId = process.env.APP_ID;

  const response = await backend.post(
    "/s1services",
    { clientID, ...payload, appId },
    { responseType: "arraybuffer" } // 👈 critical
  );

  const text = iconv.decode(Buffer.from(response.data), "win1253").trim();

  if (!text) {
    return new NextResponse(null, { status: 200 });
  }

  try {
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    // In case the ERP returns non-JSON text
    return NextResponse.json(
      { success: false, error: text, errorcode: -1 },
      { status: 200 }
    );
  }
}
