import { NextRequest, NextResponse } from "next/server";

// Paths that are public and allowed even without auth
const PUBLIC_PATHS = ["/login", "/register", "/api/public"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // 1️⃣ If user has token and tries to access login or register, redirect to home
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    // 2️⃣ Allow public paths without token
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 3️⃣ If no token and trying to access protected route, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 4️⃣ If token exists and route is not public, allow
    return NextResponse.next();
}

// Apply middleware only for these routes
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"], // include login/register to handle token redirect
};
