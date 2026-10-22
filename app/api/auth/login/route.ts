
import { NextResponse } from "next/server";

import { getDiscordAuthorizationUrl } from "@/lib/auth/discord";
import {
    createOAuthState,
    setOAuthState,
} from "@/lib/auth/session";

const ALLOWED_RETURN_PATHS = new Set([
    "/dashboard",
    "/vault",
]);

export async function GET(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    const requestedReturnTo =
        requestUrl.searchParams.get("returnTo") ?? "/dashboard";

    const returnTo = ALLOWED_RETURN_PATHS.has(requestedReturnTo)
        ? requestedReturnTo
        : "/dashboard";

    try {
        const state = createOAuthState();

        await setOAuthState(state);

        const response = NextResponse.redirect(
            getDiscordAuthorizationUrl(state)
        );

        // Store the return destination in a short-lived, HTTP-only cookie.
        response.cookies.set("quill_ink_auth_return", returnTo, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 600,
        });

        return response;
    } catch (error) {
        console.error(
            "[Auth] Failed to start Discord OAuth.",
            error
        );

        return NextResponse.redirect(
            new URL("/?auth_error=configuration", origin)
        );
    }
}
