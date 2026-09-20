import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/backend";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/services", "/about", "/contact"];

const roleHome: Record<string, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician-dashboard",
  ADMIN: "/admin-dashboard",
};

const roleRequired: Record<string, string> = {
  "/dashboard": "CUSTOMER",
  "/technician-dashboard": "TECHNICIAN",
  "/admin-dashboard": "ADMIN",
};

const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, "=");
    const decoded = JSON.parse(
      Buffer.from(padded, "base64").toString("utf-8")
    ) as { role?: string };
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

async function readAuth(request: NextRequest): Promise<{
  token: string | null;
  role: string | null;
}> {
  const raw = request.cookies.get(TOKEN_COOKIE)?.value;
  let token: string | null = null;
  if (raw) {
    try {
      token = decodeURIComponent(raw);
    } catch {
      token = raw;
    }
  }
  return { token, role: token ? decodeJwtRole(token) : null };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { token: accessToken, role } = await readAuth(request);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (accessToken && role && isAuthRoute) {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/dashboard", request.url));
  }

  if (accessToken && !role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(TOKEN_COOKIE, "", accessCookieOptions);
    return response;
  }

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  for (const [prefix, required] of Object.entries(roleRequired)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      if (role !== required) {
        return NextResponse.redirect(
          new URL((role && roleHome[role]) ?? "/dashboard", request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|webp|gif|svg|avif)$).*)"],
};
