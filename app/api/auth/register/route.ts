import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api";
import { routeError } from "@/lib/http";
import type { User } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    await serverFetch<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(
      { data: { message: "Account created successfully" } },
      { status: 201 }
    );
  } catch (error) {
    return routeError(error);
  }
}
