---
plugin_id: anchor
access: premium
premium: true
review_status: source-grounded-draft
source_root: plugins/anchor
---

# Anchor

**Access classification:** Premium required.

**Basis:** Explicit premium access declaration/comment found in source.

## Overview

Create persistent custom embed messages for your server.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

**Access/permission metadata in command source:**
- `premium`

**commands identified:**
- `/anchor create` — Create a persistent Anchor message in this channel.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `AnchorPlugin`
*File:* `plugins/anchor/AnchorPlugin.ts`

**Methods found:** `async()`

### `AnchorService`
*File:* `plugins/anchor/AnchorService.ts`

**Methods found:** `createAnchor()`, `validateUrl()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **modal forms**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **premium entitlement check**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- CHANNEL CHECK
- SEND MESSAGE
- SEND EMBED 
- VIEW MESSAGE
- SEMD EMBED LINKS
- ATTACH FILES
- ADD REACTIONS 
- MENTION USER


## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/anchor/AnchorPlugin.ts`
- `plugins/anchor/AnchorService.ts`
- `plugins/anchor/commands/AnchorCommand.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
