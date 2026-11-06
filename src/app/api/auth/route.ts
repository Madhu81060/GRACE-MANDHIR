import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@gracemandhir.org";
const ADMIN_PASS = "Grace@2027";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      (email?.toLowerCase() === ADMIN_EMAIL || email?.toLowerCase() === "admin") &&
      (password === ADMIN_PASS || password === "admin123")
    ) {
      return NextResponse.json({
        authenticated: true,
        token: "gmc-session-2027-verified",
        user: {
          name: "Grace Mandhir Admin",
          email: ADMIN_EMAIL,
          church: "Grace Mandhir Church",
        },
      });
    }

    return NextResponse.json(
      {
        authenticated: false,
        error: "Invalid credentials. Use admin@gracemandhir.org / Grace@2027",
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false, error: "Authentication request failed" },
      { status: 500 }
    );
  }
}
