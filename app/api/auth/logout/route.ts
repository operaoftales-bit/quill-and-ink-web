import { NextResponse } from "next/server";

import { clearSession } from "@/lib/auth/session";

export async function GET(request: Request): Promise<Response> {
    const origin = new URL(request.url).origin;

    await clearSession();

    return NextResponse.redirect(
        new URL("/", origin)
    );
}