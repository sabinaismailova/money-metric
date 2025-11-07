import { NextResponse } from "next/server";

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    credentials: "include",
  });

  const isLoggedIn = res.ok;

  if (!isLoggedIn && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!isLoggedIn && pathname === "/addTransaction") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/addTransaction"],
};
