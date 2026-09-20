import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";

export function routeError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  console.error("[routeError]", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
