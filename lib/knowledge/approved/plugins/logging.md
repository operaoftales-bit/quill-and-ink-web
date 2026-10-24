---
plugin_id: logging
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/logging
---

# Logging

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Server event and moderation logging.

## User-facing commands

/logging - sets the channel where the logging message will be sent

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `LoggingPlugin`
*File:* `plugins/logging/LoggingPlugin.ts`

**Methods found:** `async()`, `getDatabase()`, `getConfig()`, `sendLog()`, `truncate()`, `getUserIdentity()`, `getUserAvatar()`, `getTimestamp()`, `getMemberCount()`, `handleMemberJoin()`, `handleMemberLeave()`, `handleMessageDelete()`, `handleMessageUpdate()`, `handleVoiceStateUpdate()`, `handleBanAdd()`, `handleBanRemove()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **member join/leave handling**.
- The plugin source includes evidence of **voice-state handling**.

### Explicit source comments / rules

- LOAD CONFIGURATION
- General logging requires a configured
- logging channel.
- CHANNEL SWITCH

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/logging/LoggingPlugin.ts`
- `plugins/logging/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
