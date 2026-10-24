---
plugin_id: moderation
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/moderation
---

# Moderation

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Moderation tools for managing Discord servers.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/autorole`
*Defined in:* `plugins/moderation/commands/AutoRoleCommand.ts`

Configure the automatic role system.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/autorole set` — Set the role given to new members.
- `/autorole role` — The role to give new members.
- `/autorole disable` — Disable automatic roles.
- `/autorole view` — View the current automatic role.

**Options identified:**
- `role` — The role to give new members.

### `/ban`
*Defined in:* `plugins/moderation/commands/BanCommand.ts`

Bans a member from the server.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member to ban.
- `reason` — Reason for the ban.

### `/case`
*Defined in:* `plugins/moderation/commands/CaseCommand.ts`

View a moderation case.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `number` — The moderation case number.

### `/clearwarn`
*Defined in:* `plugins/moderation/commands/ClearWarnCommand.ts`

Remove a warning from a member.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `warning` — The warning ID to remove.

### `/clearwarnings`
*Defined in:* `plugins/moderation/commands/ClearWarningsCommand.ts`

Clear all warnings for a member.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member whose warnings will be cleared.

### `/kick`
*Defined in:* `plugins/moderation/commands/KickCommand.ts`

Kicks a member from the server.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member to kick.
- `reason` — Reason for the kick.

### `/lock`
*Defined in:* `plugins/moderation/commands/LockCommand.ts`

Lock the current channel.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `reason` — Reason for locking the channel.

### `/purge`
*Defined in:* `plugins/moderation/commands/PurgeCommand.ts`

Delete multiple messages from this channel. 

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `amount` — Number of messages to delete (1-100).

### `/setmodlog`
*Defined in:* `plugins/moderation/commands/SetModLogCommand.ts`

Set the channel where moderation logs are sent.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `channel` — The channel for moderation logs.

### `/slowmode`
*Defined in:* `plugins/moderation/commands/SlowmodeCommand.ts`

Set the slowmode delay for this channel.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `seconds` — Slowmode delay in seconds (0-21600).

### `/timeout`
*Defined in:* `plugins/moderation/commands/TimeoutCommand.ts`

Timeouts a member.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member to timeout.
- `duration` — Duration in minutes.
- `reason` — Reason for the timeout.

### `/unban`
*Defined in:* `plugins/moderation/commands/UnbanCommand.ts`

Unban a user from this server.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The Discord user ID to unban.
- `reason` — Reason for the unban.

### `/unlock`
*Defined in:* `plugins/moderation/commands/UnlockCommand.ts`

Unlock the current channel.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `reason` — Reason for unlocking the channel.

### `/untimeout`
*Defined in:* `plugins/moderation/commands/UntimeoutCommand.ts`

Remove a timeout from a member.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member to remove the timeout from.
- `reason` — Reason for removing the timeout.

### `/warn`
*Defined in:* `plugins/moderation/commands/WarnCommand.ts`

Warns a member and saves the warning.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member to warn.
- `reason` — Reason for the warning.

### `/warnings`
*Defined in:* `plugins/moderation/commands/WarningsCommand.ts`

View a member

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `user` — The member whose warnings you want to view.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `ModerationPlugin`
*File:* `plugins/moderation/ModerationPlugin.ts`

**Methods found:** `async()`, `handleMessage()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **message event handling**.
- The plugin source includes evidence of **discord permissions checks**.
- The plugin source includes evidence of **role hierarchy checks**.

### Explicit source comments / rules

- • Channel slowmode
- • Channel locking
- • Moderation logging configuration
- • Automatic roles
- SET AUTO ROLE
- Managed / integration role
- Bot role hierarchy
- Save configuration
- DISABLE AUTO ROLE
- VIEW AUTO ROLE
- CHANNEL
- LOCK CHANNEL
- The channel was already locked.
- CHANNEL CHECK
- SAVE CONFIGURATION
- A failed response must not be treated
- logging channel, not moderationLogId.
- Logging failure must never make a
- GUILD CONFIG
- LOG CHANNEL
- Logging failure must never make
- maximum length of 512 characters.
- A moderator cannot timeout a member
- whose highest role is equal to or above
- the moderator's highest role.
- the timeout so the normal operation has
- APPLY TIMEOUT
- The Discord timeout succeeded,
- the channel so the moderation case can
- UNLOCK CHANNEL
- channel, so keep the moderator
- The channel was successfully unlocked,
- TIMEOUT STATUS
- REMOVE TIMEOUT
- Timeout removal succeeded,

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/moderation/ModerationPlugin.ts`
- `plugins/moderation/commands/AutoRoleCommand.ts`
- `plugins/moderation/commands/BanCommand.ts`
- `plugins/moderation/commands/CaseCommand.ts`
- `plugins/moderation/commands/ClearWarnCommand.ts`
- `plugins/moderation/commands/ClearWarningsCommand.ts`
- `plugins/moderation/commands/KickCommand.ts`
- `plugins/moderation/commands/LockCommand.ts`
- `plugins/moderation/commands/PurgeCommand.ts`
- `plugins/moderation/commands/SetModLogCommand.ts`
- `plugins/moderation/commands/SlowmodeCommand.ts`
- `plugins/moderation/commands/TimeoutCommand.ts`
- `plugins/moderation/commands/UnbanCommand.ts`
- `plugins/moderation/commands/UnlockCommand.ts`
- `plugins/moderation/commands/UntimeoutCommand.ts`
- `plugins/moderation/commands/WarnCommand.ts`
- `plugins/moderation/commands/WarningsCommand.ts`
- `plugins/moderation/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
