import { NextResponse } from "next/server";
import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_VALUE,
} from "@/lib/demo-auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { username, password } = body as {
    username?: string;
    password?: string;
  };

  const isProd = process.env.NODE_ENV === "production";
  const expectedUser =
    process.env.DEMO_USERNAME ?? (!isProd ? "dentnav@gmail.com" : undefined);
  const expectedPass =
    process.env.DEMO_PASSWORD ?? (!isProd ? "dentnav" : undefined);

  if (!expectedUser || !expectedPass) {
    return NextResponse.json(
      {
        error:
          "Demo auth is not configured. Set DEMO_USERNAME and DEMO_PASSWORD in .env.local (see .env.example).",
      },
      { status: 503 },
    );
  }

  if (username !== expectedUser || password !== expectedPass) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
