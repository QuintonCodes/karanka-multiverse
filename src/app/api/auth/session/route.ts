import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session?.email) {
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 401 },
    );
  }

  const user = await db.user.findUnique({
    where: { email: session.email },
  });

  return NextResponse.json({ user, isAuthenticated: !!user });
}
