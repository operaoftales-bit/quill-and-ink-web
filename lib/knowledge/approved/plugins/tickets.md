---
plugin_id: Tickets
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/Tickets
---

# Tickets

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Simple support ticket system for Quill & Ink.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/ticket`
*Defined in:* `plugins/Tickets/commands/TicketCommand.ts`

Create or manage a support ticket

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/ticket create` — Create a new support ticket
- `/ticket close` — Close the current ticket

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `TicketsPlugin`
*File:* `plugins/Tickets/index.ts`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **timers or scheduled processing**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- BOT PERMISSIONS
- CREATE CHANNEL
- CHANNEL CHECK

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/Tickets/commands/TicketCommand.ts`
- `plugins/Tickets/index.ts`
- `plugins/Tickets/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
