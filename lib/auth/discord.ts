
const DISCORD_API_BASE = "https://discord.com/api/v10";

interface DiscordTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
}

export interface DiscordUser {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    discriminator: string;
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
}

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export function getDiscordAuthorizationUrl(state: string): string {
    const clientId = getRequiredEnv("DISCORD_CLIENT_ID");
    const redirectUri = getRequiredEnv("DISCORD_REDIRECT_URI");

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: "identify guilds",
        state,
    });

    return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function exchangeDiscordCode(
    code: string
): Promise<DiscordTokenResponse> {
    const clientId = getRequiredEnv("DISCORD_CLIENT_ID");
    const clientSecret = getRequiredEnv("DISCORD_CLIENT_SECRET");
    const redirectUri = getRequiredEnv("DISCORD_REDIRECT_URI");

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
    });

    const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Discord token exchange failed with status ${response.status}.`
        );
    }

    return (await response.json()) as DiscordTokenResponse;
}

export async function getDiscordUser(
    accessToken: string
): Promise<DiscordUser> {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Discord user request failed with status ${response.status}.`
        );
    }

    return (await response.json()) as DiscordUser;
}

export async function getDiscordGuilds(
    accessToken: string
): Promise<DiscordGuild[]> {
    const response = await fetch(
        `${DISCORD_API_BASE}/users/@me/guilds`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Discord guild request failed with status ${response.status}.`
        );
    }

    return (await response.json()) as DiscordGuild[];
}
