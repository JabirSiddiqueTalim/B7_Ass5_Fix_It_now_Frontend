import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api";
import { routeError } from "@/lib/http";
import type { User } from "@/lib/types";

export async function GET() {
  try {
    const user = await serverFetch<User>("/api/auth/me");
    return NextResponse.json({ data: user });
  } catch (error) {
    return routeError(error);
  }
}
