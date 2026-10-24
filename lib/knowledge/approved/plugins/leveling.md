---
plugin_id: Leveling
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/Leveling
---

# Leveling

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

XP and leveling system for Quill & Ink.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/leaderboard`
*Defined in:* `plugins/Leveling/commands/LeaderboardCommand.ts`

View the leaderboard of users.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/levelroleconfig`
*Defined in:* `plugins/Leveling/commands/LevelRoleConfigCommand.ts`

Configure automatic roles awarded at leveling milestones

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/leveling`
*Defined in:* `plugins/Leveling/commands/LevelingCommand.ts`

Configure leveling channels, rich embeds, custom messages, and banner images

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/leveling enable` — Enable level-up announcements
- `/leveling disable` — Disable level-up announcements
- `/leveling channel` — Add or remove a level-up announcement channel
- `/leveling action` — Choose whether to add or remove a channel
- `/leveling channels` — List all level-up announcement channels
- `/leveling message` — Set the level-up announcement message
- `/leveling message` — Message text; placeholders such as {user} and {level} are supported
- `/leveling title` — Set the level-up announcement embed title
- `/leveling title` — Embed title; placeholders are supported
- `/leveling image` — Set the level-up announcement banner image
- `/leveling url` — Direct image URL displayed below the announcement text
- `/leveling color` — Set the level-up announcement embed color
- `/leveling color` — Hex color such as #48D7FF
- `/leveling footer` — Set the level-up announcement embed footer
- `/leveling footer` — Embed footer text; placeholders are supported
- `/leveling thumbnail` — Choose whether the user
- `/leveling enabled` — Show the user
- `/leveling timestamp` — Choose whether level-up announcements show a timestamp
- `/leveling enabled` — Show the current time in the embed
- `/leveling preview` — Preview the current level-up announcement configuration

**Options identified:**
- `action` — Choose whether to add or remove a channel
- `channel` — The channel to add or remove
- `message` — Message text; placeholders such as {user} and {level} are supported
- `title` — Embed title; placeholders are supported
- `url` — Direct image URL displayed below the announcement text
- `color` — Hex color such as #48D7FF
- `footer` — Embed footer text; placeholders are supported
- `enabled` — Show the user
- `enabled` — Show the current time in the embed


### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `LevelRoleHandler`
*File:* `plugins/Leveling/LevelRoleHandler.ts`

### `LevelingPlugin`
*File:* `plugins/Leveling/index.ts`

**Methods found:** `isSameDay()`, `isYesterday()`, `replacePlaceholders()`, `parseLevelingColor()`, `isValidHttpUrl()`, `handleMessage()`, `cleanupCooldowns()`, `randomXP()`, `xpForLevel()`, `buildLevelingEmbed()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **select menus**.
- The plugin source includes evidence of **modal forms**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **message event handling**.
- The plugin source includes evidence of **discord permissions checks**.
- The plugin source includes evidence of **role hierarchy checks**.

### Explicit source comments / rules

- Assign the role configured for a specific level.
- - Adds only the role configured for the reached level.
- - Never removes existing roles.
- - Never replaces previous level roles.
- - Safely handles deleted, managed, or unassignable roles.
- LOAD LEVEL ROLE CONFIGURATION
- No reward is configured for this level.
- RESOLVE DISCORD ROLE
- The role may have been deleted manually
- ROLE SAFETY CHECKS
- @everyone and managed roles cannot be awarded
- BOT PERMISSION / HIERARCHY CHECK
- The bot must have Manage Roles and the target
- role must be strictly below the bot's highest role.
- already have the configured role.
- ASSIGN ROLE
- a role assignment failed.
- @everyone cannot be assigned as a reward.
- Managed/integration roles cannot be
- Discord requires the bot's highest role
- to be above the role it is assigning.
- DEFAULTS
- CHANNEL
- CHANNEL LIST
- PERMISSIONS
- CHANNEL ADD / REMOVE
- CONFIGURATION
- Keeps the in-memory cooldown map from growing forever.
- Default leveling announcement values.
- Removes expired cooldown entries periodically.
- Checks whether a configured URL is a valid
- Converts a configured hexadecimal color into
- Builds the configurable level-up embed.
- Defaults to enabled through Prisma.
- PERIODIC COOLDOWN CLEANUP

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/Leveling/LevelRoleHandler.ts`
- `plugins/Leveling/commands/LeaderboardCommand.ts`
- `plugins/Leveling/commands/LevelRoleConfigCommand.ts`
- `plugins/Leveling/commands/LevelingCommand.ts`
- `plugins/Leveling/index.ts`
- `plugins/Leveling/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
