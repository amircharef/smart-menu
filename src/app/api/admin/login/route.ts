import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash || typeof password !== "string") {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const valid = await compare(password, hash);
  if (!valid) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
