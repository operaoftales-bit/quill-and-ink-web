---
plugin_id: opera-assistant
access: premium
premium: true
review_status: source-grounded-draft
source_root: plugins/opera-assistant
---

# Opera Assistant

**Access classification:** Premium required.

**Basis:** Explicit premium access declaration/comment found in source.

## Overview

A modular AI-powered server assistant for Quill & Ink.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

users can chat with opera assistant just by saying "Hey quill, Hey ink, Hey opera".

### `/assistant-knowledge`
*Defined in:* `plugins/opera-assistant/commands/AssistantKnowledgeCommand.ts`

Manage Opera Assistant

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/assistant-knowledge set` — Add or update a piece of Opera
- `/assistant-knowledge key` — The name of the knowledge entry.
- `/assistant-knowledge get` — View a specific piece of Opera
- `/assistant-knowledge key` — The knowledge entry to retrieve.
- `/assistant-knowledge list` — List all knowledge stored for this server.
- `/assistant-knowledge delete` — Delete a piece of Opera
- `/assistant-knowledge key` — The knowledge entry to delete.

**Options identified:**
- `key` — The name of the knowledge entry.
- `content` — The information Opera should remember.
- `key` — The knowledge entry to retrieve.
- `key` — The knowledge entry to delete.

The knowledge set by the commands are server only and stored on database so when a member asks anything about the server opera assistant can view the set knowledge and answer it.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `OperaAssistantPlugin`
*File:* `plugins/opera-assistant/OperaAssistantPlugin.ts`

**Methods found:** `getAssistantService()`, `getProvider()`

### `GroqProvider`
*File:* `plugins/opera-assistant/GroqProvider.ts`

**Methods found:** `generate()`

### `OllamaProvider`
*File:* `plugins/opera-assistant/OllamaProvider.ts`

**Methods found:** `generate()`

### `AssistantContextService`
*File:* `plugins/opera-assistant/AssistantContextService.ts`

**Methods found:** `getContext()`

### `AssistantService`
*File:* `plugins/opera-assistant/AssistantService.ts`

**Methods found:** `ask()`

### `AssistantMessageHandler`
*File:* `plugins/opera-assistant/AssistantMessageHandler.ts`

**Methods found:** `isReplyToOpera()`, `getWakeResponse()`, `safeSend()`, `trackOperaMessage()`, `findTrigger()`, `splitMessage()`

### `AssistantKnowledgeService`
*File:* `plugins/opera-assistant/AssistantKnowledgeService.ts`

**Methods found:** `get()`, `getAll()`, `set()`, `delete()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **message event handling**.
- The plugin source includes evidence of **premium entitlement check**.
- The plugin source includes evidence of **external ai provider**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- Defaults to Ollama to preserve existing local behavior.
- Only messages sent by this
- DISCORD MESSAGE LIMIT
- A reply activates Opera only when
- If Discord cannot fetch the
- FALLBACK CHANNEL MESSAGE

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/opera-assistant/OperaAssistantPlugin.ts`
- `plugins/opera-assistant/ai/AIProvider.ts`
- `plugins/opera-assistant/ai/GroqProvider.ts`
- `plugins/opera-assistant/ai/OllamaProvider.ts`
- `plugins/opera-assistant/commands/AssistantKnowledgeCommand.ts`
- `plugins/opera-assistant/core/AssistantContextService.ts`
- `plugins/opera-assistant/core/AssistantService.ts`
- `plugins/opera-assistant/events/AssistantMessageHandler.ts`
- `plugins/opera-assistant/plugin.json`
- `plugins/opera-assistant/services/AssistantKnowledgeService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
