import { NextResponse } from "next/server";
import { serverFetch, decodeJwtRole } from "@/lib/api";
import { routeError } from "@/lib/http";
import type { AuthTokens } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tokens = await serverFetch<AuthTokens>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const role = decodeJwtRole(tokens.accessToken) ?? "CUSTOMER";

    const response = NextResponse.json({ data: { ...tokens, role } });
    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    return routeError(error);
  }
}
