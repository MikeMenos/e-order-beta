import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { decodeBackendResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const { branch, trdr, family } = await req.json();

    const clientID = process.env.CLIENT_ID;

    const url = !family
      ? "/s1services/js/api.web/ITEMS_PER_CUST_ART"
      : "/s1services/js/api.web/ITEMS_PER_CUST_NEW";

    const response = await backend.post(
      url,
      { branch, trdr, family, clientID },
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
