---
plugin_id: reactionroles
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/reactionroles
---

# Reaction Roles

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Give and remove Discord roles using reactions.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/setreactionrole`
*Defined in:* `plugins/reactionroles/commands/SetReactionRoleCommand.ts`

Create a reaction role dashboard

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `channel` — Channel where the reaction role dashboard will appear

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `ReactionRoleService`
*File:* `plugins/reactionroles/ReactionRoleService.ts`

**Methods found:** `createReactionRole()`, `getReactionRole()`, `getDashboardRoles()`, `getGuildReactionRoles()`, `addRole()`, `removeRole()`, `updateDashboard()`, `deleteMessageRoles()`, `deleteReactionRole()`, `fetchMember()`

### `ReactionRolesPlugin`
*File:* `plugins/reactionroles/ReactionRolesPlugin.ts`

**Methods found:** `async()`, `handleReaction()`, `getEmojiIdentifier()`, `resolveUser()`, `resolveReaction()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **select menus**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **reaction handling**.
- The plugin source includes evidence of **discord permissions checks**.
- The plugin source includes evidence of **role hierarchy checks**.

### Explicit source comments / rules

- CREATE REACTION ROLE
- VALIDATE ROLE
- ROLE HIERARCHY
- GET REACTION ROLE
- GET DASHBOARD ROLES
- GET GUILD REACTION ROLES
- ADD ROLE
- Never attempt to assign managed roles.
- Already has role.
- Server owner cannot have roles managed
- REMOVE ROLE
- Managed roles cannot be manually removed.
- Server owner cannot normally be modified.
- if the Discord role was deleted.
- DELETE DASHBOARD ROLES
- DELETE SINGLE REACTION ROLE
- of a configured dashboard.
- ROLE
- ROLE VALIDATION
- APPLY ROLE
- CONFIGURATION
- PERMISSION CHECK
- CHANNEL
- TypeScript-safe channel reference.
- At this point the channel is guaranteed to be
- a text-based guild channel that supports
- BOT PERMISSIONS
- Manage Roles is required for actually
- assigning reaction roles.
- PENDING CONFIGURATION
- Only the person who created the
- dashboard can configure it.
- MANAGED ROLE
- BOT ROLE POSITION
- Collect only a message from the

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/reactionroles/ReactionRoleService.ts`
- `plugins/reactionroles/ReactionRolesPlugin.ts`
- `plugins/reactionroles/commands/SetReactionRoleCommand.ts`
- `plugins/reactionroles/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
