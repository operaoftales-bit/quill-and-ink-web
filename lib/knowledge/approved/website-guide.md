# Quill & Ink Website Guide

## Purpose
The Quill & Ink website helps visitors discover the bot's plugins, understand its features and Premium plan, learn about the project, contact the team, and access available website tools.

Website tagline: Built for communities. Made for stories.

## Public Website Pages

### Home (`/`)
The main landing page introduces Quill & Ink and helps visitors discover the bot.

### Explore (`/explore`)
The plugin directory lets visitors browse available plugins and discover the functionality offered by Quill & Ink.

### Plugin Details (`/explore/[pluginId]`)
Each plugin has a detail page associated with its plugin ID. Visitors can use these pages to learn more about individual plugins. Consult the actual plugin data and details for specific commands, requirements, and functionality.

### Pricing (`/pricing`)
Explains the available Premium offering and pricing. Quill & Ink Premium costs ₹350 / around $4 for 30 days and does not automatically renew. Premium purchases are made through the bot in Discord, not directly through the website.

To begin the Premium purchase process, run `/setup` in the Discord server, select the Premium option, and follow the instructions provided by the bot.

### About (`/about`)
Provides information about the Quill & Ink project.

### Contact (`/contact`)
The website's contact page provides the available contact information or contact options. Do not invent contact methods that are not displayed on the page.

## Legal and Policy Pages

- `/terms` — Terms of service.
- `/privacy` — Privacy policy.
- `/refunds` — Refund policy.
- `/shipping` — Shipping policy.

For questions about a specific policy, use the relevant page's actual content rather than guessing what the policy says.

## Discord Bot Invitation

Visitors can invite Quill & Ink to a Discord server using the official invitation link:

https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot

After inviting the bot, server administrators can use `/setup` in Discord to explore available setup options.

## Support

Official support server:
https://discord.gg/3qbKqxBJDa

Direct visitors to the support server when they need help with bot configuration, feature questions, Premium purchases, or issues that cannot be answered confidently from the approved knowledge files.

## Dashboard

The website includes dashboard routes:

- `/dashboard` — Dashboard entry page.
- `/dashboard/[guildId]` — Dashboard for a specific Discord server.
- `/dashboard/[guildId]/automod` — AutoMod dashboard for a specific server.

Authentication routes exist under `/api/auth/`, and dashboard authorization and AutoMod API routes exist under `/api/dashboard/`. These are implementation routes, not ordinary pages visitors should navigate to manually.

Do not claim that every plugin can be configured through the dashboard. Only describe dashboard features supported by approved documentation and the actual implementation.

## Testing Pages and Internal Routes

The `/assistant` and `/vault` pages are testing pages and should not be presented as regular public website destinations.

API routes under `/api/` provide application functionality and are not general-purpose website pages. Do not direct visitors to API endpoints unless an approved instruction specifically requires it.

## Accuracy Rules

- Use the actual website pages and approved knowledge files as the source of truth.
- Do not invent website features, contact methods, documentation pages, dashboard capabilities, or purchase methods.
- Distinguish browsing plugin information on the website from running commands in Discord.
- If a visitor asks for details that are not documented, acknowledge the limitation and direct them to the official support server when appropriate.