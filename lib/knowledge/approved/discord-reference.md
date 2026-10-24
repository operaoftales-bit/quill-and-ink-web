# Discord Reference Guide

## Purpose
This document provides general reference information about Discord commands, permissions, roles, channels, and bot access. It is a cross-reference for Opera Assistant, not documentation of Quill & Ink's internal implementation.

Use official Discord documentation for general Discord behavior. Use Quill & Ink's approved knowledge files for bot-specific commands, features, and requirements.

## Official Discord Sources

### Slash Commands FAQ
https://support-apps.discord.com/hc/en-us/articles/26501837786775-Slash-Commands-FAQ

Explains:
- What slash commands are and how to access them.
- How Discord displays and filters available commands.
- How autocomplete helps users select valid options.
- The role of the Use Slash Commands permission.

### Command Permissions
https://support-apps.discord.com/hc/en-us/articles/26501869403159-Command-Permissions

Explains:
- How to find an application's command permissions.
- How to control which members and roles can use commands.
- How to restrict commands to particular channels.
- How to configure individual command overrides.
- Where to inspect the application's granted and denied permissions.

The documented desktop navigation is Server Settings → Integrations → select the application. Available controls may depend on the user's permissions and Discord's current interface.

### Discord Roles and Permissions
https://support.discord.com/hc/en-us/articles/214836687-Discord-Roles-and-Permissions

Explains:
- How Discord roles and permissions work.
- How role hierarchy affects moderation and role management.
- How channel-specific permission settings affect access.
- Why Administrator access should be assigned carefully.

## Slash Command Basics
Slash commands are Discord application commands accessed through the command interface, usually by typing `/`.

Discord can display matching commands and their options. Some commands may be unavailable or hidden for a user because of command permissions or application configuration.

If a command is missing:
1. Confirm that the correct bot or application is installed in the server.
2. Check whether the command appears in Discord's command picker.
3. Check the application's command permissions in Server Settings → Integrations.
4. Check the relevant channel's permissions and the user's assigned roles.
5. Consult the bot's approved documentation for any additional restrictions.

Do not assume that every missing command is caused by insufficient permissions.

## Command Permissions vs. Bot Permissions

### Command Permissions
These control who can invoke application commands and where those commands can be used. Discord provides controls for members, roles, channels, and individual commands.

### Bot Permissions
These determine which actions the bot is allowed to perform in a server or channel. Examples of permission needs depend on the feature being used.

A user being allowed to invoke a command does not automatically mean the bot has permission to complete the requested action.

When troubleshooting, check both command access and the permissions required for the intended action.

## Roles and Channel Permissions
Discord permissions can be influenced by server roles, role hierarchy, and channel-specific permission overrides.

A bot may need additional permissions for actions such as managing roles, moderating members, or managing channels. The exact requirements depend on the operation.

Do not recommend granting Administrator as a default troubleshooting step. Identify the specific permission required by the relevant feature whenever possible.

## Quill & Ink Cross-Reference Rules
This document describes Discord generally. It does not establish the exact behavior of Quill & Ink.

When answering a question:
- Use this document to explain general Discord concepts.
- Use the approved Quill & Ink plugin file to establish the bot's actual commands and feature-specific permission requirements.
- Do not assume that every Quill & Ink command uses the same permission rules.
- Do not claim a permission is required by Quill & Ink solely because Discord supports that permission.
- Do not promise that changing a permission will resolve an issue without enough evidence.
- If Discord's current interface or behavior may have changed, consult the official source linked above.

## When Information Is Missing
If the official Discord references and approved Quill & Ink knowledge do not establish the answer, explain what remains uncertain. For Quill & Ink-specific problems, direct the user to the official support server:

https://discord.gg/3qbKqxBJDa