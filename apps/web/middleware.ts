import { NextRequest, NextResponse } from "next/server";

// All routes are accessible without login.
// Data-dependent pages (vault, channels, ops) show an AuthGate client-side
// instead of hard-redirecting, so guest users can still see what the app does.

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};
