import { NextResponse } from "next/server";

import { getDiscordAuthorizationUrl } from "@/lib/auth/discord";
import {
    createOAuthState,
    setOAuthState,
} from "@/lib/auth/session";

export async function GET(request: Request): Promise<Response> {
    const origin = new URL(request.url).origin;

    try {
        const state = createOAuthState();

        await setOAuthState(state);

        return NextResponse.redirect(
            getDiscordAuthorizationUrl(state)
        );
    } catch (error) {
        console.error("[Auth] Failed to start Discord OAuth.", error);

        return NextResponse.redirect(
            new URL("/?auth_error=configuration", origin)
        );
    }
}