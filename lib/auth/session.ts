
import { cookies } from "next/headers";

const SESSION_COOKIE = "quill_ink_session";

const STATE_COOKIE = "quill_ink_oauth_state";

const SESSION_MAX_AGE = 60 * 60 * 24;

const STATE_MAX_AGE = 60 * 10;

export interface AuthorizedGuild {
    id: string;
    name: string;
    icon: string | null;
}

export interface AuthSession {
    userId: string;
    username: string;
    globalName: string | null;
    avatar: string | null;
    authorizedGuilds: AuthorizedGuild[];
    issuedAt: number;
}

function getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
        throw new Error(
            "Missing required environment variable: SESSION_SECRET"
        );
    }

    if (secret.length < 32) {
        throw new Error(
            "SESSION_SECRET must be at least 32 characters long."
        );
    }

    return secret;
}

function bytesToBase64Url(bytes: Uint8Array): string {
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
    const normalized = value
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(value.length / 4) * 4, "=");

    const binary = atob(normalized);

    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

function encodeText(value: string): Uint8Array<ArrayBuffer> {
    return new TextEncoder().encode(value) as Uint8Array<ArrayBuffer>;
}

function decodeText(value: Uint8Array): string {
    return new TextDecoder().decode(value);
}

async function sign(value: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        encodeText(getSessionSecret()),
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encodeText(value)
    );

    return bytesToBase64Url(new Uint8Array(signature));
}

async function verifySignature(
    value: string,
    signature: string
): Promise<boolean> {
    const expected = await sign(value);

    if (expected.length !== signature.length) {
        return false;
    }

    let difference = 0;

    for (let index = 0; index < expected.length; index += 1) {
        difference |=
            expected.charCodeAt(index) ^
            signature.charCodeAt(index);
    }

    return difference === 0;
}

function encodePayload(payload: AuthSession): string {
    return bytesToBase64Url(
        encodeText(JSON.stringify(payload))
    );
}
function decodePayload(value: string): AuthSession | null {
    try {
        const decoded = decodeText(
            base64UrlToBytes(value)
        );

        const payload = JSON.parse(decoded) as AuthSession;

        if (
            typeof payload.userId !== "string" ||
            typeof payload.username !== "string" ||
            typeof payload.issuedAt !== "number"
        ) {
            return null;
        }

        if (
            payload.globalName !== null &&
            typeof payload.globalName !== "string"
        ) {
            return null;
        }

        if (
            payload.avatar !== null &&
            typeof payload.avatar !== "string"
        ) {
            return null;
        }

        if (
            !Array.isArray(payload.authorizedGuilds) ||
            payload.authorizedGuilds.some(
                (guild) =>
                    typeof guild !== "object" ||
                    guild === null ||
                    typeof guild.id !== "string" ||
                    typeof guild.name !== "string" ||
                    (
                        guild.icon !== null &&
                        typeof guild.icon !== "string"
                    )
            )
        ) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export function createOAuthState(): string {
    const bytes = crypto.getRandomValues(
        new Uint8Array(32)
    );

    return bytesToBase64Url(bytes);
}

export async function setOAuthState(
    state: string
): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set({
        name: STATE_COOKIE,
        value: state,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: STATE_MAX_AGE,
    });
}

export async function consumeOAuthState(
    receivedState: string
): Promise<boolean> {
    const cookieStore = await cookies();

    const storedState =
        cookieStore.get(STATE_COOKIE)?.value;

    cookieStore.delete(STATE_COOKIE);

    if (!storedState || !receivedState) {
        return false;
    }

    if (storedState.length !== receivedState.length) {
        return false;
    }

    let difference = 0;

    for (
        let index = 0;
        index < storedState.length;
        index += 1
    ) {
        difference |=
            storedState.charCodeAt(index) ^
            receivedState.charCodeAt(index);
    }

    return difference === 0;
}

export async function createSession(
    session: AuthSession
): Promise<void> {
    const payload = encodePayload(session);

    const signature = await sign(payload);

    const value = `${payload}.${signature}`;

    const cookieStore = await cookies();

    cookieStore.set({
        name: SESSION_COOKIE,
        value,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });
}

export async function getSession(): Promise<AuthSession | null> {
    const cookieStore = await cookies();

    const value =
        cookieStore.get(SESSION_COOKIE)?.value;

    if (!value) {
        return null;
    }

    const separatorIndex = value.lastIndexOf(".");

    if (
        separatorIndex <= 0 ||
        separatorIndex === value.length - 1
    ) {
        return null;
    }

    const payload = value.slice(
        0,
        separatorIndex
    );

    const signature = value.slice(
        separatorIndex + 1
    );

    if (
        !(await verifySignature(
            payload,
            signature
        ))
    ) {
        return null;
    }

    const session = decodePayload(payload);

    if (!session) {
        return null;
    }

    const sessionAge =
        Math.floor(Date.now() / 1000) -
        session.issuedAt;

    if (
        sessionAge < 0 ||
        sessionAge > SESSION_MAX_AGE
    ) {
        return null;
    }

    return session;
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE);
}

