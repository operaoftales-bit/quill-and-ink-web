---
plugin_id: giveaway
access: premium
premium: true
review_status: source-grounded-draft
source_root: plugins/giveaway
---

# Giveaway

**Access classification:** Premium required.

**Basis:** Explicit premium access declaration/comment found in source.

## Overview

Persistent giveaways with weighted entries, finalists, winners and rerolls.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/giveaway`
*Defined in:* `plugins/giveaway/commands/GiveawayCommand.ts`

Create and manage giveaways.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/giveaway start` — Start a giveaway in this channel.
- `/giveaway name` — Name of the giveaway.
- `/giveaway config` — Configure server-wide giveaway entry bonuses.
- `/giveaway level` — Add or update a server-wide level bonus.
- `/giveaway role` — Add or update a server-wide role bonus.
- `/giveaway remove-level` — Remove a server-wide level bonus.
- `/giveaway remove-role` — Remove a server-wide role bonus.
- `/giveaway view` — View the server-wide giveaway configuration.
- `/giveaway cancel` — Cancel an active giveaway.
- `/giveaway giveaway` — Giveaway ID.
- `/giveaway reroll` — Reroll a winner from the giveaway

**Options identified:**
- `name` — Name of the giveaway.
- `text` — The text shown in the giveaway.
- `prize` — The prize being given away.
- `duration` — Duration, for example 30m, 2h, or 3d.
- `winners` — Number of winners.
- `level` — Minimum level required.
- `entries` — Bonus entries granted at this level.
- `role` — Role receiving bonus entries.
- `entries` — Bonus entries granted by this role.
- `level` — Level bonus to remove.
- `role` — Role bonus to remove.
- `giveaway` — Giveaway ID.
- `winner` — Winner number to reroll.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.


## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `GiveawayPlugin`
*File:* `plugins/giveaway/index.ts`

**Methods found:** `handleButton()`, `parsePage()`, `Number()`, `showEntries()`, `String()`, `finalizeExpiredGiveaways()`

### `GiveawayService`
*File:* `plugins/giveaway/GiveawayService.ts`

**Methods found:** `createGiveaway()`, `joinGiveaway()`, `getEntries()`, `recalculateEntries()`, `setConfigLevelBonus()`, `removeConfigLevelBonus()`, `setConfigRoleBonus()`, `removeConfigRoleBonus()`, `getGiveawayConfig()`, `finalizeGiveaway()`, `cancelGiveaway()`, `rerollWinner()`, `getExpiredGiveaways()`, `buildActiveEmbed()`, `String()`, `buildButtons()`, `refreshActiveGiveawayMessage()`, `publishFinalResult()`, `publishCancellation()`, `publishRerollResult()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **timers or scheduled processing**.
- The plugin source includes evidence of **premium entitlement check**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- Giveaway is a Premium plugin.
- Giveaway buttons are also Premium.
- Only handle actions that belong to this plugin.
- custom IDs, even when only one page exists.
- configuration into this giveaway.
- Future configuration changes do not
- Snapshot server-wide role bonuses.
- GiveawayRoleBonus and GiveawayLevelBonus
- All matching role bonuses stack.
- Only the highest matching
- SERVER-WIDE CONFIGURATION
- Only the top 10 become finalists.
- The prize remains a manual reward.
- Use the exact giveaway channel.

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/giveaway/commands/GiveawayCommand.ts`
- `plugins/giveaway/index.ts`
- `plugins/giveaway/services/GiveawayService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
