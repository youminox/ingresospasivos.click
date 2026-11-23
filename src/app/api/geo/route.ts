import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

export function GET(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;
  return NextResponse.json(
    { country },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
      },
    }
  );
}
