import { NextResponse } from "next/server";
import iconv from "iconv-lite";

/**
 * Decodes arraybuffer response from backend and parses JSON
 * Handles errors gracefully and returns consistent error responses
 */
export async function decodeBackendResponse(response: {
  data: ArrayBuffer;
}): Promise<NextResponse> {
  try {
    const text = iconv.decode(Buffer.from(response.data), "win1253").trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Empty response from backend", errorcode: -1 },
        { status: 200 }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      // In case the ERP returns non-JSON text
      return NextResponse.json(
        {
          success: false,
          error: text,
          errorcode: -1,
        },
        { status: 200 }
      );
    }
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
