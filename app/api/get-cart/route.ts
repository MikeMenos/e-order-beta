import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import iconv from "iconv-lite";

export async function POST(req: Request) {
    const { branch, trdr } = await req.json();
    const clientID = process.env.CLIENT_ID;

    const { data } = await backend.post(
        "/s1services/js/api.web/ITEMS_IN_BASKET",
        { clientID, trdr, branch },
        { responseType: "arraybuffer" }
    );

    const text = iconv.decode(Buffer.from(data), "win1253");

    return NextResponse.json(JSON.parse(text));
}
