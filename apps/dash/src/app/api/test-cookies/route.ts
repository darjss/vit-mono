import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🧪 === COOKIE TEST ENDPOINT ===");
  console.log("🧪 Request URL:", req.url);
  console.log("🧪 Request origin:", req.headers.get("origin"));

  // Test all cookie access methods
  console.log("🧪 NextJS req.cookies.getAll():", req.cookies.getAll());
  console.log(
    "🧪 NextJS req.cookies.get('store_session'):",
    req.cookies.get("store_session"),
  );
  console.log("🧪 Raw Cookie header:", req.headers.get("cookie"));

  // Log all headers for debugging
  console.log("🧪 All headers:");
  for (const [key, value] of req.headers.entries()) {
    console.log(`🧪   ${key}: ${value}`);
  }

  const response = NextResponse.json({
    cookiesFromNextJS: req.cookies.getAll(),
    rawCookieHeader: req.headers.get("cookie"),
    storeSession: req.cookies.get("store_session")?.value || null,
    allHeaders: Object.fromEntries(req.headers.entries()),
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
