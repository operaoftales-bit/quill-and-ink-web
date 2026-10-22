"use client";

import { useEffect, useState } from "react";

type CommunitySnapshot = {
  serverCount: number;
  totalMembers: number;
  uptimeSeconds: number | null;
  recordedAt: string;
};

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone: "cyan" | "gold" | "violet";
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const CLOCK_INTERVAL_MS = 60 * 1000;
const STALE_AFTER_MS = 45 * 60 * 1000;

const tones = {
  cyan: {
    border: "border-[#45647b]/35 hover:border-[#79d9e9]/45",
    glow: "bg-[#68d9eb]/10",
    icon: "border-[#79d9e9]/20 bg-[#68d9eb]/[0.07] text-[#79d9e9]",
    title: "text-[#8da9b9]",
    value: "text-[#eaf8fa]",
  },
  gold: {
    border: "border-[#d0b16b]/25 hover:border-[#d0b16b]/50",
    glow: "bg-[#d0b16b]/[0.08]",
    icon: "border-[#d0b16b]/25 bg-[#d0b16b]/[0.07] text-[#dfc17c]",
    title: "text-[#bba56e]",
    value: "text-[#f5f0e4]",
  },
  violet: {
    border: "border-[#8a7bd4]/25 hover:border-[#a99cf0]/45",
    glow: "bg-[#9c8bf0]/[0.09]",
    icon: "border-[#a99cf0]/25 bg-[#9c8bf0]/[0.07] text-[#b9adff]",
    title: "text-[#b9adff]",
    value: "text-[#f0edff]",
  },
};

function StatCard({
  title,
  value,
  description,
  icon,
  tone,
}: StatCardProps) {
  const style = tones[tone];

  return (
    <article
      className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border bg-[#091a2a]/85 p-4 text-left transition duration-300 sm:gap-4 sm:p-5 ${style.border}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-3xl ${style.glow}`}
      />

      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${style.icon}`}
      >
        {icon}
      </div>

      <div className="relative min-w-0 flex-1">
        <p
          className={`text-[10px] font-medium uppercase tracking-[0.18em] ${style.title}`}
        >
          {title}
        </p>

        <p
          aria-live="polite"
          className={`mt-1 font-serif text-2xl font-medium leading-tight tracking-tight sm:text-3xl ${style.value}`}
        >
          {value}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#9eb5c4]">
          {description}
        </p>
      </div>
    </article>
  );
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatUptime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (days) return `${days}d ${hours}h ${minutes}m`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Update time unavailable"
    : `${new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "UTC",
      }).format(date)} UTC`;
}

function formatSnapshotAge(recordedAt: string, now: number) {
  const timestamp = new Date(recordedAt).getTime();
  if (Number.isNaN(timestamp)) return "Age unavailable";

  const minutes = Math.floor(Math.max(0, now - timestamp) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainder = minutes % 60;
    return remainder ? `${hours}h ${remainder}m ago` : `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  const remainder = hours % 24;
  return remainder ? `${days}d ${remainder}h ago` : `${days}d ago`;
}

const icons = {
  servers: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="4" width="16" height="6" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" />
      <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
    </svg>
  ),
  members: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19z" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 13h.5a4 4 0 0 1 4 4v2h-4" />
    </svg>
  ),
  uptime: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2M8 2.8 6.5 4.3M16 2.8l1.5 1.5" />
    </svg>
  ),
};

export default function CommunityStats() {
  const [snapshot, setSnapshot] = useState<CommunitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) throw new Error("Statistics request failed.");

        const data = await response.json();
        const stats = data.stats as CommunitySnapshot | null | undefined;

        if (
          !stats ||
          typeof stats.serverCount !== "number" ||
          typeof stats.totalMembers !== "number" ||
          (typeof stats.uptimeSeconds !== "number" &&
            stats.uptimeSeconds !== null) ||
          typeof stats.recordedAt !== "string" ||
          Number.isNaN(new Date(stats.recordedAt).getTime())
        ) {
          throw new Error("Invalid statistics response.");
        }

        if (active) {
          setSnapshot(stats);
          setUnavailable(false);
        }
      } catch {
        if (active) setUnavailable(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    setNow(Date.now());
    void loadStats();

    const refresh = window.setInterval(loadStats, REFRESH_INTERVAL_MS);
    const clock = window.setInterval(
      () => setNow(Date.now()),
      CLOCK_INTERVAL_MS
    );

    return () => {
      active = false;
      window.clearInterval(refresh);
      window.clearInterval(clock);
    };
  }, []);

  const age =
    snapshot && now
      ? Math.max(0, now - new Date(snapshot.recordedAt).getTime())
      : 0;
  const isStale = age > STALE_AFTER_MS;

  const value = (number: number | undefined) =>
    loading || number === undefined ? "—" : formatCount(number);

  return (
    <section
      aria-labelledby="community-stats-heading"
      className="relative overflow-hidden border-y border-[#45647b]/20 bg-[#081827]/65 px-5 py-9 sm:px-8 sm:py-11"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(84%,900px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6bcddd]/30 to-transparent"
      />

      <div className="relative mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#79d9e9] sm:text-[11px]">
            A community in motion
          </p>

          <h2
            id="community-stats-heading"
            className="mt-2 font-serif text-2xl font-medium leading-tight tracking-[-0.035em] text-[#f3f4f0] sm:text-3xl"
          >
            More than a bot.{" "}
            <span className="bg-gradient-to-r from-[#8be0ec] via-[#c5eaf0] to-[#d4b879] bg-clip-text text-transparent">
              Part of your community.
            </span>
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#9eb5c4]">
            A little glimpse of the communities growing with Quill &amp; Ink.
          </p>
        </header>

        <div className="mx-auto mt-5 grid max-w-5xl gap-3 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3">
          <StatCard
            title="Discord servers"
            value={value(snapshot?.serverCount)}
            description="Communities using Quill & Ink"
            tone="cyan"
            icon={icons.servers}
          />
          <StatCard
            title="Community members"
            value={value(snapshot?.totalMembers)}
            description="Across connected servers"
            tone="gold"
            icon={icons.members}
          />
          <StatCard
            title="Bot uptime"
            value={
              loading
                ? "—"
                : snapshot?.uptimeSeconds != null
                  ? formatUptime(snapshot.uptimeSeconds)
                  : "Unavailable"
            }
            description="Uptime at the recorded snapshot"
            tone="violet"
            icon={icons.uptime}
          />
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-1.5 text-center">
          {loading ? (
            <p className="text-xs text-[#819bab]">
              Gathering the latest community statistics…
            </p>
          ) : unavailable && !snapshot ? (
            <p className="text-xs text-[#a5b8c4]">
              Community statistics are temporarily unavailable. Please check
              back soon.
            </p>
          ) : snapshot ? (
            <>
              <p className="text-xs text-[#819bab]">
                Last snapshot recorded{" "}
                <time dateTime={snapshot.recordedAt}>
                  {formatUpdatedAt(snapshot.recordedAt)}
                </time>
                {now > 0 && <> · {formatSnapshotAge(snapshot.recordedAt, now)}</>}
              </p>

              {isStale && (
                <p className="text-xs text-[#d9bd82]">
                  These statistics may be outdated while the next snapshot is
                  pending.
                </p>
              )}

              {unavailable && (
                <p className="text-xs text-[#a5b8c4]">
                  The latest refresh failed. Showing the last successfully
                  retrieved snapshot.
                </p>
              )}
            </>
          ) : null}

          <p className="text-[10px] uppercase tracking-[0.14em] text-[#657f91]">
            Statistics update periodically
          </p>
        </div>
      </div>
    </section>
  );
}