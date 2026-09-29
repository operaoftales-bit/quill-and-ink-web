
import { NextResponse } from "next/server";

import {
    exchangeDiscordCode,
    getDiscordGuilds,
    getDiscordUser,
} from "@/lib/auth/discord";
import {
    consumeOAuthState,
    createSession,
} from "@/lib/auth/session";

export async function GET(
    request: Request
): Promise<Response> {
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");
    const error = requestUrl.searchParams.get("error");

    if (error) {
        return NextResponse.redirect(
            new URL("/?auth_error=denied", origin)
        );
    }

    if (!code || !state) {
        return NextResponse.redirect(
            new URL("/?auth_error=invalid_callback", origin)
        );
    }

    try {
        const validState =
            await consumeOAuthState(state);

        if (!validState) {
            return NextResponse.redirect(
                new URL("/?auth_error=invalid_state", origin)
            );
        }

        const token =
            await exchangeDiscordCode(code);

        const user =
            await getDiscordUser(
                token.access_token
            );

        const guilds =
            await getDiscordGuilds(
                token.access_token
            );

        const administratorPermission =
            BigInt(1) << BigInt(3);

       const authorizedGuilds = guilds
    .filter((guild) => {
        const permissions =
            BigInt(guild.permissions);

        return (
            guild.owner ||
            (
                permissions &
                administratorPermission
            ) !== BigInt(0)
        );
    })
    .map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon
    }));


        await createSession({
            userId: user.id,
            username: user.username,
            globalName: user.global_name,
            avatar: user.avatar,
            authorizedGuilds,
            issuedAt: Math.floor(
                Date.now() / 1000
            ),
        });

        return NextResponse.redirect(
            new URL("/dashboard", origin)
        );
    } catch (error) {
        console.error(
            "[Auth] Discord OAuth callback failed.",
            error
        );

        return NextResponse.redirect(
            new URL("/?auth_error=oauth_failed", origin)
        );
    }
}
