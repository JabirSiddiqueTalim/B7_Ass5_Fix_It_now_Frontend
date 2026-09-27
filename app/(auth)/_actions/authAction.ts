"use server";

import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { RegisterRequest } from "@/lib/types";

export interface LoginState {
  success: boolean;
  message: string | null;
}

export interface RegisterState {
  success: boolean;
  message: string | null;
}

const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://backend-ecru-five-26.vercel.app";

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function setAuthCookie(accessToken: string): Promise<void> {
  return cookies().then((cookieStore) => {
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  });
}

function redirectForRole(role: string | undefined): never {
  if (role === "CUSTOMER") redirect("/dashboard");
  if (role === "TECHNICIAN") redirect("/technician-dashboard");
  if (role === "ADMIN") redirect("/admin-dashboard");
  redirect("/dashboard");
}

export async function loginAction(
  redirectTo: string,
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return { success: false, message: "Email and password are required." };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Check your connection and try again.",
    };
  }

  const result = (await res.json().catch(() => null)) as {
    success: boolean;
    statusCode: number;
    message: string;
    data?: { accessToken: string };
  } | null;

  if (!result?.success || !result.data?.accessToken) {
    return {
      success: false,
      message: result?.message ?? "Sign-in failed. Try again.",
    };
  }

  await setAuthCookie(result.data.accessToken);

  if (
    redirectTo &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    redirect(redirectTo);
  }

  const decodedToken = jwt.decode(result.data.accessToken) as
    | JwtPayload
    | null;
  redirectForRole(decodedToken?.role);
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const role = formData.get("role");
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const phone = readField(formData, "phone");
  const address = readField(formData, "address");

  if (role !== "CUSTOMER" && role !== "TECHNICIAN") {
    return {
      success: false,
      message: "Pick an account type: Customer or Technician.",
    };
  }

  if (
    name.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !password ||
    !phone
  ) {
    return {
      success: false,
      message: "Name, a valid email, phone and password are required.",
    };
  }

  const base = {
    role,
    name,
    email,
    password,
    phone,
    ...(address ? { address } : {}),
  };

  let body: RegisterRequest;
  if (role === "TECHNICIAN") {
    const bio = readField(formData, "bio");
    const skills = readField(formData, "skills")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const hourlyRate = readField(formData, "hourlyRate");
    const experienceYrs = readField(formData, "experienceYrs");
    const location = readField(formData, "location");

    if (hourlyRate && Number(hourlyRate) <= 0) {
      return {
        success: false,
        message: "Hourly rate must be a positive number.",
      };
    }
    if (experienceYrs && Number(experienceYrs) < 0) {
      return {
        success: false,
        message: "Years of experience can't be negative.",
      };
    }

    body = {
      ...base,
      role: "TECHNICIAN",
      ...(bio ? { bio } : {}),
      ...(skills.length ? { skills } : {}),
      ...(hourlyRate ? { hourlyRate: Number(hourlyRate) } : {}),
      ...(experienceYrs ? { experienceYrs: Number(experienceYrs) } : {}),
      ...(location ? { location } : {}),
    };
  } else {
    body = { ...base, role: "CUSTOMER" };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      message:
        "Could not reach the server. Check your connection and try again.",
    };
  }

  const result = (await res.json().catch(() => null)) as {
    success: boolean;
    statusCode: number;
    message: string;
  } | null;

  if (!result?.success) {
    const message =
      result?.statusCode === 409
        ? "An account with this email already exists. Log in instead."
        : result?.message ?? "Registration failed. Try again.";
    return { success: false, message };
  }

  let loginRes: Response;
  try {
    loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { success: false, message: "Account created. Please sign in." };
  }

  const loginResult = (await loginRes.json().catch(() => null)) as {
    success: boolean;
    data?: { accessToken: string };
  } | null;

  if (!loginResult?.success || !loginResult.data?.accessToken) {
    return { success: false, message: "Account created. Please sign in." };
  }

  await setAuthCookie(loginResult.data.accessToken);

  const decodedToken = jwt.decode(loginResult.data.accessToken) as
    | JwtPayload
    | null;
  redirectForRole(decodedToken?.role);
}