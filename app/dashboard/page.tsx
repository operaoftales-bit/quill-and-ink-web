import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/api/auth/discord");
    }

    const guilds = session.authorizedGuilds;

    return (
        <main className="min-h-screen bg-[#061525] px-6 py-16 text-[#f5f7f8]">
            <div className="mx-auto max-w-6xl">

                <div className="mb-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#75d9eb]">
                        Quill & Ink Dashboard
                    </p>

                    <h1 className="mt-3 font-serif text-4xl font-semibold">
                        Choose a server
                    </h1>

                    <p className="mt-3 max-w-2xl text-[#9db5c6]">
                        Select a server you manage to configure
                        Quill & Ink.
                    </p>
                </div>

                {guilds.length === 0 ? (
                    <div className="rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-8">
                        <h2 className="text-xl font-semibold">
                            No manageable servers found
                        </h2>

                        <p className="mt-3 text-[#9db5c6]">
                            Your Discord account does not currently
                            have Owner or Administrator access to
                            any servers available to Quill & Ink.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {guilds.map((guild) => (
                            <a
                                key={guild.id}
                                href={`/dashboard/${guild.id}`}
                                className="group rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6 transition hover:border-[#65d8eb]/50 hover:bg-[#0b2034]"
                            >
                                <div className="flex items-center gap-4">

                                    {guild.icon ? (
                                        <img
                                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                                            alt=""
                                            className="h-16 w-16 rounded-2xl border border-[#47718c]/30"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#47718c]/30 bg-[#0a2539] text-xl font-semibold text-[#72d8ed]">
                                            {guild.name
                                                .slice(0, 1)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold text-[#f3f8fa]">
                                            {guild.name}
                                        </h2>

                                        <p className="mt-1 text-sm text-[#7894a8]">
                                            Manage server
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-[#47718c]/20 pt-4">
                                    <span className="text-sm text-[#9db5c6]">
                                        Open dashboard
                                    </span>

                                    <span className="text-[#72d8ed] transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                <div className="mt-10 border-t border-[#47718c]/20 pt-6">
                    <a
                        href="/api/auth/logout"
                        className="text-sm text-[#7894a8] transition hover:text-[#f3f8fa]"
                    >
                        Sign out
                    </a>
                </div>

            </div>
        </main>
    );
}