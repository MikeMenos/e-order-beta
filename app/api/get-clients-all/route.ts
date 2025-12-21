import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { decodeBackendResponse } from "@/lib/api-utils";
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = typeof body?.q === "string" ? body.q.trim() : "";

    const clientID = process.env.CLIENT_ID;

    const payload: Record<string, unknown> = { clientID };

    if (q) {
      if (/^\d+$/.test(q)) payload.AFM = q;
      else payload.NAME = q;
    }

    const response = await backend.post(
      "/s1services/js/api.web/PELATES_ALL",
      payload,
      { responseType: "arraybuffer" }
    );

    return decodeBackendResponse(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        errorcode: -1,
      },
      { status: 500 }
    );
  }
}
