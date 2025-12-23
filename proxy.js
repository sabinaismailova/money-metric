import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = req.cookies.get("token");

  const { pathname } = req.nextUrl;

  if (!token && pathname != "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/addTransaction"],
};
