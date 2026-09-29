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

export async function POST(
    request: Request
): Promise<Response> {
    try {
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

        const body =
            (await request.json()) as {
                guildId?: unknown;
            };

        if (
            typeof body.guildId !== "string" ||
            !body.guildId.trim()
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "INVALID_GUILD_ID"
                },
                {
                    status: 400
                }
            );
        }

        const guildId =
            body.guildId.trim();

        /*
         * The browser is never trusted to choose an
         * arbitrary guild. The guild must already exist
         * in the user's OAuth-authorized guild list.
         */
        if (
    !session.authorizedGuilds.some(
        (guild) => guild.id === guildId
    )

        ) {
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

        const backendResponse =
            await fetch(
                `${backendUrl}/dashboard/authorize`,
                {
                    method: "GET",
                    headers: {
                        "x-quill-user-id":
                            session.userId,

                        "x-quill-guild-id":
                            guildId,

                        "x-quill-timestamp":
                            timestamp,

                        "x-quill-signature":
                            signature
                    },
                    cache: "no-store"
                }
            );

        const responseText =
            await backendResponse.text();

        let responseBody: unknown;

        try {
            responseBody =
                JSON.parse(responseText);
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
                    backendResponse.status
            }
        );

    } catch (error) {

        console.error(
            "[Dashboard] Authorization proxy failed.",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "DASHBOARD_AUTHORIZATION_FAILED"
            },
            {
                status: 500
            }
        );
    }
}