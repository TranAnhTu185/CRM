import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Nếu chưa có token => redirect về login
  if (!token && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu đã login => cấm vào /login
  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  return NextResponse.next();
}

// Áp dụng cho toàn bộ route trừ static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
