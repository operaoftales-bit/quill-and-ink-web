# Bulletin

## Overview

Bulletin lets community members nominate messages using reactions. When a message meets the configured emoji and reaction-count requirements, the bot posts a formatted entry in the server's configured bulletin channel. Premium: True

## Commands

### `/setbulletinchannel`

Configures the channel where nominated messages are published.

- Requires a text or announcement channel.
- The command is marked as premium in the plugin source.
- The command specifies the Discord `Manage Server` permission.

### `/setbulletinemoji`

Configures the emoji used to nominate messages.

- The command is marked as premium in the plugin source.
- The command specifies the Discord `Manage Server` permission.
- Its description refers to the emoji and reaction count required for nomination.

**Note:** The service supports a reaction threshold, but the exact user-facing threshold configuration has not yet been verified.

## Default configuration

When a bulletin configuration is first created, the service sets:

- Emoji: ⭐
- Reaction threshold: 5

These are initial defaults, not a guarantee that every server currently uses them.

## How nominations work

The plugin listens for added message reactions. Its handler checks the configured bulletin emoji and threshold, verifies that the plugin is enabled for the server, and attempts to retrieve the nominated message.

When the checks pass, the service posts a formatted entry in the configured bulletin channel.

The source confirms that the listener is marked as premium. Exact runtime access-control behavior depends on the plugin framework.

## Published message format

A bulletin entry includes:

- A Bulletin heading and pin emoji.
- The message author's username.
- A mention of the original channel.
- The message's text, or a placeholder when it has no text.
- A community-nominated label.
- A link to jump to the original message.

The verified implementation copies the message text into the bulletin entry. It does not establish that attachments or embeds are copied.

## Configuration and limitations

- Configuration is stored per server.
- The bulletin channel must be configured before the service can update the emoji or threshold.
- The verified listener handles added reactions; removal behavior has not been established.
- A matching reaction does not, by itself, guarantee publication: other checks and successful message retrieval are required.

## Evidence status

This guide was prepared from Tracebook-generated source evidence and a review of the relevant plugin and service implementation.

It describes verified source behavior. Unverified behavior is explicitly marked rather than assumed.