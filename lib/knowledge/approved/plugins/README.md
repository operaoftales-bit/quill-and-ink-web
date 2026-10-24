
### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.


# Quill & Ink source-grounded documentation pack

Generated from the supplied source archive `src.zip` on 2026-10-23. Plugin folders analysed: 25.

## Files

- `GLOBAL-SYSTEMS-EVENTS-COMMANDS.md` — core loaders, event handlers, global services, core commands, environment references, schema overview, and cross-cutting guidance.
- One Markdown file per plugin folder.

## Important scope note

These documents are grounded in the provided source snapshot. Static inspection can identify declared commands, access markers, permission checks, handlers, services, and hardcoded constants, but it cannot verify the deployed bot, the live command registry, current environment variables, or server-specific Discord permissions. Where an access gate was not explicit in the plugin folder, the docs flag that limitation rather than silently asserting a global guarantee.

## Premium classification

The source uses more than one form of access evidence: explicit `access: "premium"` metadata, calls that request/check the `premium` entitlement, and comments describing Premium-only systems. This is more reliable than searching only for the literal `premium: true`. Plugin docs explain the evidence they found.

## Plugin index

- [`Leveling`](./leveling.md) — basic-free
- [`Tickets`](./tickets.md) — basic-free
- [`Advanced AutoMod`](./advanced-automod.md) — premium
- [`Anchor`](./anchor.md) — premium
- [`AutoMod`](./automod.md) — basic-free
- [`Birthday Tracker`](./birthday.md) — basic-free
- [`Bulletin`](./bulletin.md) — premium
- [`Confessions`](./confessions.md) — basic-free
- [`Economy`](./economy.md) — basic-free
- [`Games`](./games.md) — basic-free
- [`Giveaway`](./giveaway.md) — premium
- [`Inventory`](./inventory.md) — basic-free
- [`Logging`](./logging.md) — basic-free
- [`Moderation`](./moderation.md) — basic-free
- [`Opera Assistant`](./opera-assistant.md) — premium
- [`Premium Tickets`](./premium-tickets.md) — premium
- [`Pressure`](./pressure.md) — premium
- [`Reaction Roles`](./reactionroles.md) — basic-free
- [`Robbery`](./robbery.md) — premium
- [`Store`](./store.md) — basic-free
- [`TCG`](./tcg.md) — basic-free
- [`Test Plugin`](./test.md) — basic-free
- [`Utility`](./utility.md) — basic-free
- [`Voice`](./voice.md) — premium
- [`Welcome`](./welcome.md) — basic-free