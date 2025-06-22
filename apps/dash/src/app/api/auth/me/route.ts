import { NextRequest, NextResponse } from "next/server";
import { auth } from "@vit/api/lib/session";
import { parse } from "cookie";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    let token: string | null = null;

    if (cookieHeader) {
      const cookies = parse(cookieHeader);
      token = cookies.store_session || null;
    }

    const session = await auth(token);

    const response = NextResponse.json({
      user: session?.user || null,
      isAuthenticated: !!session,
    });

    // Set CORS headers
    const origin = req.headers.get("origin");
    if (
      origin &&
      ["http://localhost:4321", "https://localhost:4321"].includes(origin)
    ) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 500 },
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });

  if (
    origin &&
    ["http://localhost:4321", "https://localhost:4321"].includes(origin)
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Cookie",
    );
  }

  return response;
}
