import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { decodeBackendResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const { AFM } = await req.json();

    const clientID = process.env.CLIENT_ID;

    const response = await backend.post(
      "/s1services/js/api.web/PELATES",
      { AFM, clientID },
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
