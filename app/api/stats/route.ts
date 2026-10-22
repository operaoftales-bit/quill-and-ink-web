
import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";
export const revalidate = 300;

const globalForStats = globalThis as typeof globalThis & {
    statsPool?: Pool;
};

function getPool(): Pool {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not configured.");
    }

    if (!globalForStats.statsPool) {
        globalForStats.statsPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 2,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 10000,
        });
    }

    return globalForStats.statsPool;
}

export async function GET() {
    try {
        const pool = getPool();

        const result = await pool.query(`
            SELECT
                "serverCount",
                "totalMembers",
                "uptimeSeconds",
                ("recordedAt" AT TIME ZONE 'UTC') AS "recordedAt"
            FROM public."SiteStatsSnapshot"
            ORDER BY "recordedAt" DESC
            LIMIT 1
        `);

        return NextResponse.json(
            {
                stats: result.rows[0] ?? null,
            },
            {
                headers: {
                    "Cache-Control":
                        "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("[Stats API] Failed to fetch statistics:", error);

        return NextResponse.json(
            {
                error: "Statistics are temporarily unavailable.",
            },
            { status: 503 }
        );
    }
}
