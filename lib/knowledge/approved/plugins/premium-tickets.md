---
plugin_id: premium-tickets
access: premium
premium: true
review_status: source-grounded-draft
source_root: plugins/premium-tickets
---

# Premium Tickets

**Access classification:** Premium required.

**Basis:** Explicit premium access declaration/comment found in source.

## Overview

Advanced private support tickets with persistent configuration.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/premium-ticket`
*Defined in:* `plugins/premium-tickets/commands/PremiumTicketCommand.ts`

Manage the Premium Ticket system. opens a presistant panel on where the command is used

**Access/permission metadata in command source:**
- `premium`

**Subcommands identified:**
- `/premium-ticket setup` — Create the Premium Ticket panel in this channel.
- `/premium-ticket category` — Manage Premium Ticket categories.
- `/premium-ticket add` — Add a Premium Ticket category.
- `/premium-ticket name` — The category name.
- `/premium-ticket remove` — Remove a Premium Ticket category.
- `/premium-ticket name` — The category name to remove.
- `/premium-ticket list` — List Premium Ticket categories.
- `/premium-ticket staff` — Manage Premium Ticket staff.
- `/premium-ticket role-add` — Add a staff role.
- `/premium-ticket role` — The role authorized to access Premium Tickets.
- `/premium-ticket role-remove` — Remove a staff role.
- `/premium-ticket role` — The staff role to remove.
- `/premium-ticket role-list` — List configured staff roles.
- `/premium-ticket member-add` — Add a staff member.
- `/premium-ticket member` — The member authorized to access Premium Tickets.
- `/premium-ticket member-remove` — Remove a staff member.
- `/premium-ticket member` — The staff member to remove.
- `/premium-ticket member-list` — List configured staff members.

**Options identified:**
- `name` — The category name.
- `description` — Explain what this category is for.
- `name` — The category name to remove.
- `role` — The role authorized to access Premium Tickets.
- `role` — The staff role to remove.
- `member` — The member authorized to access Premium Tickets.
- `member` — The staff member to remove.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `PremiumTicketsPlugin`
*File:* `plugins/premium-tickets/PremiumTicketsPlugin.ts`

**Methods found:** `async()`

### `PremiumTicketsService`
*File:* `plugins/premium-tickets/PremiumTicketsService.ts`

**Methods found:** `createPanel()`, `addCategory()`, `removeCategory()`, `listCategories()`, `createCategoryMenu()`, `addStaffRole()`, `removeStaffRole()`, `listStaffRoles()`, `addStaffMember()`, `removeStaffMember()`, `listStaffMembers()`, `getAuthorizedStaffIds()`, `createTicket()`, `closeTicket()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **select menus**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **premium entitlement check**.
- The plugin source includes evidence of **discord permissions checks**.

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/premium-tickets/PremiumTicketsPlugin.ts`
- `plugins/premium-tickets/PremiumTicketsService.ts`
- `plugins/premium-tickets/commands/PremiumTicketCommand.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
