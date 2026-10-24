---
plugin_id: welcome
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/welcome
---

# Welcome

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Welcome and leave messages for Discord servers.

## User-facing commands
 
 ** Commands identifiers**
 /welcome set - set the welcome channel
 /welcome message - configure the welcome message
 /welcome dmmessage - configure the welcome DM message
 /welcome preview - preview the current welcome message
 /welcome view - view the current welcome setting
 /welcome disable - disables the welcome plugin
 /welcome dm - enable or disable the welcome dm message

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

the welcome plugin can only be disabled by the command to enable it after disabling it the admin need to use /setup command instead of /welcome enable.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `WelcomePlugin`
*File:* `plugins/welcome/WelcomePlugin.ts`

## Interactions and automatic behaviour

No specific interaction/event pattern was safely detected by static scan.

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/welcome/WelcomePlugin.ts`
- `plugins/welcome/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
- theres is no leave option in welcome the bot only sends the welcome message not leave message.