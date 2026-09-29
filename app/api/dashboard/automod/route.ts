import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";

import { getSession } from "@/lib/auth/session";

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value;
}

async function proxyRequest(
    request: Request,
    guildId: string
): Promise<Response> {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            {
                ok: false,
                error: "UNAUTHENTICATED"
            },
            {
                status: 401
            }
        );
    }

    const authorizedGuild =
        session.authorizedGuilds.some(
            guild => guild.id === guildId
        );

    if (!authorizedGuild) {
        return NextResponse.json(
            {
                ok: false,
                error: "GUILD_NOT_AUTHORIZED"
            },
            {
                status: 403
            }
        );
    }

    const timestamp =
        Date.now().toString();

    const payload =
        `${session.userId}:${guildId}:${timestamp}`;

    const signature =
        createHmac(
            "sha256",
            getRequiredEnv(
                "DASHBOARD_API_SECRET"
            )
        )
            .update(payload)
            .digest("hex");

    const backendUrl =
        getRequiredEnv(
            "DASHBOARD_BACKEND_URL"
        );

    const headers: HeadersInit = {
        "x-quill-user-id":
            session.userId,

        "x-quill-guild-id":
            guildId,

        "x-quill-timestamp":
            timestamp,

        "x-quill-signature":
            signature
    };

    if (
        request.method !== "GET"
    ) {
        headers["Content-Type"] =
            "application/json";

        headers["Content-Length"] =
            String(
                (await request.clone().arrayBuffer()).byteLength
            );
    }

    const response =
        await fetch(
            `${backendUrl}/dashboard/automod`,
            {
                method:
                    request.method,

                headers,

                body:
                    request.method === "GET"
                        ? undefined
                        : await request.text(),

                cache: "no-store"
            }
        );

    const responseText =
        await response.text();

    let responseBody: unknown;

    try {
        responseBody =
            JSON.parse(
                responseText
            );
    } catch {
        responseBody = {
            ok: false,
            error:
                "INVALID_BACKEND_RESPONSE"
        };
    }

    return NextResponse.json(
        responseBody,
        {
            status:
                response.status
        }
    );
}

export async function GET(
    request: Request
): Promise<Response> {

    const url =
        new URL(
            request.url
        );

    const guildId =
        url.searchParams.get(
            "guildId"
        )?.trim();

    if (!guildId) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "INVALID_GUILD_ID"
            },
            {
                status: 400
            }
        );
    }

    try {
        return await proxyRequest(
            request,
            guildId
        );
    } catch (error) {

        console.error(
            "[Dashboard] AutoMod GET proxy failed.",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "AUTOMOD_PROXY_FAILED"
            },
            {
                status: 500
            }
        );
    }
}

export async function PUT(
    request: Request
): Promise<Response> {

    const url =
        new URL(
            request.url
        );

    const guildId =
        url.searchParams.get(
            "guildId"
        )?.trim();

    if (!guildId) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "INVALID_GUILD_ID"
            },
            {
                status: 400
            }
        );
    }

    try {
        return await proxyRequest(
            request,
            guildId
        );
    } catch (error) {

        console.error(
            "[Dashboard] AutoMod PUT proxy failed.",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "AUTOMOD_PROXY_FAILED"
            },
            {
                status: 500
            }
        );
    }
}