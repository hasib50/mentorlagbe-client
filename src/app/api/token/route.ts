import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";

// Creates a short lived JWT for the logged in BetterAuth user.
// The Express server verifies it with the same JWT_SECRET.
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return Response.json({ token: null }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return Response.json({ message: "JWT_SECRET is missing." }, { status: 500 });
    }

    const token = await new SignJWT({
      email: session.user.email,
      name: session.user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.user.id)
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(new TextEncoder().encode(secret));

    return Response.json({ token }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Token generation error:", error);
    return Response.json({ message: "Could not generate token." }, { status: 500 });
  }
}
