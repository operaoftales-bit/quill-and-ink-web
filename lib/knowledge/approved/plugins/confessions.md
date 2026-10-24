---
plugin_id: confessions
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/confessions
---

# Confessions

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Anonymous confession submissions with private moderation and public publishing.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/confessionchanneladd`
*Defined in:* `plugins/confessions/commands/ConfessionChannelCommand.ts`

Configure the public confession channel.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `channel` — The channel where approved confessions will be published.

### `/confessiondeclineddelete`
*Defined in:* `plugins/confessions/commands/ConfessionDeclinedDeleteCommand.ts`

Delete all declined confessions.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/confessions`
*Defined in:* `plugins/confessions/commands/ConfessionsCommand.ts`

Submit an anonymous confession.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/confessions submit` — Submit an anonymous confession.


### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

# A submitted confession is sent to the thread where the mods and admin can only view and the confession message wont share the details of the user who submitted it so the feature remains anonymous.
 When the mod or admin accepts the anonymous submittion the submitted message will be sent to the set channel and will be viewable for all users. But the anonymous protection will prevent the user tag of who submitted it so other can only view the message and will not know who submitted it.
## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `ConfessionsPlugin`
*File:* `plugins/confessions/index.ts`

**Methods found:** `handleButton()`, `handleModal()`

### `ConfessionService`
*File:* `plugins/confessions/ConfessionService.ts`

**Methods found:** `configureChannel()`, `getConfig()`, `submit()`, `accept()`, `decline()`, `deleteDeclined()`, `getModerators()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **modal forms**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- CONFIGURATION

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/confessions/commands/ConfessionChannelCommand.ts`
- `plugins/confessions/commands/ConfessionDeclinedDeleteCommand.ts`
- `plugins/confessions/commands/ConfessionsCommand.ts`
- `plugins/confessions/index.ts`
- `plugins/confessions/services/ConfessionService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
