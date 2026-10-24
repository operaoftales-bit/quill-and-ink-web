---
plugin_id: birthday
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/birthday
---

# Birthday Tracker

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Birthday tracking with timezone-aware reminders, announcements, roles, DMs, and optional gifts.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/birthday`
*Defined in:* `plugins/birthday/commands/BirthdayCommand.ts`

Manage birthdays and birthday settings.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/birthday set` — Set your birthday.
- `/birthday month` — Your birth month (1-12).
- `/birthday view` — View your registered birthday.
- `/birthday remove` — Remove your registered birthday.
- `/birthday list` — View birthdays registered in this server.
- `/birthday config` — Configure the birthday tracker.
- `/birthday enabled` — Enable or disable the birthday tracker.
- `/birthday enabled` — Whether birthday processing is enabled.
- `/birthday timezone` — Set the server timezone used for birthday processing.
- `/birthday timezone` — Timezone, for example Asia/Kolkata.
- `/birthday announcement` — Configure birthday announcements.
- `/birthday enabled` — Whether birthday announcements are enabled.
- `/birthday role` — Configure the birthday role.
- `/birthday enabled` — Whether the birthday role is enabled.
- `/birthday dm` — Configure birthday direct messages.
- `/birthday enabled` — Whether birthday DMs are enabled.
- `/birthday prize` — Configure the birthday Nickel reward.
- `/birthday enabled` — Whether the birthday reward is enabled.
- `/birthday view` — View the current birthday configuration.

**Options identified:**
- `month` — Your birth month (1-12).
- `day` — Your birth day.
- `year` — Your birth year (optional).
- `enabled` — Whether birthday processing is enabled.
- `timezone` — Timezone, for example Asia/Kolkata.
- `enabled` — Whether birthday announcements are enabled.
- `channel` — Channel where birthday announcements are sent.
- `message` — The birthday announcement message.
- `enabled` — Whether the birthday role is enabled.
- `role` — Role granted to members on their birthday.
- `enabled` — Whether birthday DMs are enabled.
- `message` — The birthday DM message.
- `enabled` — Whether the birthday reward is enabled.
- `amount` — Nickel awarded when the birthday gift is claimed.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `BirthdayPlugin`
*File:* `plugins/birthday/BirthdayPlugin.ts`

**Methods found:** `processBirthdays()`, `processGuildBirthdays()`, `processMemberBirthday()`, `sendAnnouncement()`, `replaceBirthdayPlaceholders()`, `grantBirthdayRole()`, `sendBirthdayDm()`, `handleRewardClaim()`

### `BirthdayService`
*File:* `plugins/birthday/BirthdayService.ts`

**Methods found:** `getBirthday()`, `setBirthday()`, `removeBirthday()`, `setBirthdayEnabled()`, `getBirthdaysForDate()`, `getGuildBirthdays()`, `getConfig()`, `getOrCreateConfig()`, `getEnabledConfigs()`, `setEnabled()`, `setTimezone()`, `configureAnnouncement()`, `configureRole()`, `configurePrize()`, `configureDm()`, `getLocalDateTime()`, `Number()`, `isLocalMidnight()`, `getBirthdayRewardClaim()`, `prepareBirthdayRewardClaim()`, `markBirthdayRewardDmSent()`, `setBirthdayRewardMessageId()`, `claimBirthdayReward()`, `getBirthdayRoleGrant()`, `recordBirthdayRoleGrant()`, `validateBirthdayDate()`, `validateMonth()`, `validateDay()`, `validateBirthYear()`, `validateTimezone()`, `isUniqueConstraintError()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **timers or scheduled processing**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- ROLE
- PREPARE REWARD
- REWARD CLAIM
- BIRTHDAY CONFIG
- BIRTHDAY ROLE

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/birthday/BirthdayPlugin.ts`
- `plugins/birthday/commands/BirthdayCommand.ts`
- `plugins/birthday/services/BirthdayService.ts`

## Documentation confidence notes should not be shared with the users.

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
- do not give the user the informations about the source inventory as well as methods found and interaction and automatic behaviour.