export type PluginCommandDetail = {
    command: string;
    description: string;
};

export type PluginFeature = {
    title: string;
    description: string;
};

export type PluginDetail = {
    pluginId: string;
    eyebrow: string;
    headline: string;
    introduction: string;
    features: PluginFeature[];
    commands: PluginCommandDetail[];
};

export const pluginDetails: PluginDetail[] = [
    {
        pluginId: "leveling",
        eyebrow: "COMMUNITY • PROGRESSION",
        headline: "Give every message a little more meaning.",
        introduction:
            "Turn everyday participation into visible progression. Leveling gives your community a simple way to reward activity while giving members something to work toward.",
        features: [
            {
                title: "Activity becomes progression",
                description:
                    "Let members naturally progress as they participate in your community.",
            },
            {
                title: "Make progression yours",
                description:
                    "Configure how leveling cards look and what information they display.",
            },
            {
                title: "Build reasons to return",
                description:
                    "Give members another reason to stay active and watch their progress grow.",
            },
        ],
        commands: [
            {
                command: "/leveling preview",
                description:
                    "Preview the current level-up announcement configuration.",
            },
            {
                command: "/leveling image",
                description:
                    "Set the direct image URL displayed below the announcement text.",
            },
            {
                command: "/leveling color",
                description:
                    "Choose the color used in the level-up announcement embed.",
            },
            {
                command: "/leveling message",
                description:
                    "Configure the message displayed in level-up announcements.",
            },
            {
                command: "/leveling thumbnail",
                description:
                    "Choose whether the user's avatar appears as the embed thumbnail.",
            },
            {
                command: "/leveling channel",
                description:
                    "Choose the channel where leveling announcements are sent.",
            },
            {
                command: "/leveling enable",
                description:
                    "Enable the leveling system for your server.",
            },
            {
                command: "/leveling disable",
                description:
                    "Disable the leveling system for your server.",
            },
            {
                command: "/leveling title",
                description:
                    "Configure the title displayed in level-up announcements.",
            },
            {
                command: "/leveling timestamp",
                description:
                    "Configure timestamp information shown in level-up announcements.",
            },
            {
                command: "/leveling footer",
                description:
                    "Configure the footer displayed in level-up announcements.",
            },
            {
                command: "/levelroleconfig",
                description:
                    "Configure roles assigned when members reach specific levels.",
            },
        ],
    },

    {
        pluginId: "reactionroles",
        eyebrow: "COMMUNITY • ROLES",
        headline: "Let your members choose their place.",
        introduction:
            "Make role selection simple by letting members interact with configured reactions to receive or remove Discord roles.",
        features: [
            {
                title: "Simple role selection",
                description:
                    "Give members an easy way to select configured roles through reactions.",
            },
            {
                title: "Less manual work",
                description:
                    "Let Quill & Ink handle role assignments instead of relying on staff to manage every request.",
            },
            {
                title: "Community-controlled access",
                description:
                    "Turn reactions into a simple interface for optional server roles.",
            },
        ],
        commands: [
            {
                command: "/setreactionrole",
                description:
                    "Create a reaction-role panel where roles and their corresponding emojis can be configured.",
            },
        ],
    },

    {
        pluginId: "welcome",
        eyebrow: "COMMUNITY • WELCOME",
        headline: "Let your members feel their value.",
        introduction:
            "Create welcome messages that make members feel noticed while giving your server a consistent way to announce new arrivals.",
        features: [
            {
                title: "Welcome your members",
                description:
                    "Create welcome messages for members joining your server.",
            },
            {
                title: "Keep members informed",
                description:
                    "Keep your community updated whenever someone new joins.",
            },
            {
                title: "Customize the experience",
                description:
                    "Configure, preview, and manage your welcome system directly from Discord.",
            },
        ],
        commands: [
            {
                command: "/welcome message",
                description:
                    "Configure the welcome message displayed when a member joins.",
            },
            {
                command: "/welcome dmmessage",
                description:
                    "Configure the direct message sent to a member when they join.",
            },
            {
                command: "/welcome set",
                description:
                    "Configure the channel where welcome messages are sent.",
            },
            {
                command: "/welcome preview",
                description:
                    "Preview the current welcome message.",
            },
            {
                command: "/welcome dm",
                description:
                    "Configure the direct message sent to a member when they join.",
            },
            {
                command: "/welcome disable",
                description:
                    "Disable the welcome system.",
            },
            {
                command: "/welcome view",
                description:
                    "View the current welcome system configuration.",
            },
        ],
    },

    {
        pluginId: "birthday",
        eyebrow: "COMMUNITY • BIRTHDAYS",
        headline: "Make their day part of the story.",
        introduction:
            "Keep track of community birthdays with timezone-aware reminders, announcements, optional roles, direct messages, and configurable birthday rewards.",
        features: [
            {
                title: "Remember the important dates",
                description:
                    "Let members register their birthdays so your community can celebrate them.",
            },
            {
                title: "Celebrate your way",
                description:
                    "Configure announcements, roles, direct messages, and birthday rewards.",
            },
            {
                title: "Respect every timezone",
                description:
                    "Use timezone-aware birthday tracking so celebrations happen at the right time for members.",
            },
        ],
        commands: [
            {
                command: "/birthday list",
                description:
                    "View the birthdays tracked by the server.",
            },
            {
                command: "/birthday config timezone",
                description:
                    "Configure the timezone used by your server.",
            },
            {
                command: "/birthday config view",
                description:
                    "View the current birthday system configuration.",
            },
            {
                command: "/birthday view",
                description:
                    "View your birthday information.",
            },
            {
                command: "/birthday config announcement",
                description:
                    "Configure birthday announcement settings.",
            },
            {
                command: "/birthday config role",
                description:
                    "Configure the role given to members on their birthdays.",
            },
            {
                command: "/birthday config dm",
                description:
                    "Configure birthday direct-message settings.",
            },
            {
                command: "/birthday config prize",
                description:
                    "Configure the birthday prize or reward.",
            },
            {
                command: "/birthday config enable",
                description:
                    "Enable the birthday system.",
            },
            {
                command: "/birthday set",
                description:
                    "Set or register a birthday.",
            },
            {
                command: "/birthday remove",
                description:
                    "Remove a registered birthday.",
            },
        ],
    },

    {
        pluginId: "confessions",
        eyebrow: "COMMUNITY • CONFESSIONS",
        headline: "Give hidden thoughts a place to speak.",
        introduction:
            "Create a space for anonymous confessions while keeping moderation tools available to the people responsible for your community.",
        features: [
            {
                title: "Anonymous submissions",
                description:
                    "Give members a way to submit confessions without publicly attaching their identity.",
            },
            {
                title: "Private moderation",
                description:
                    "Keep moderation decisions separate from the public confession experience.",
            },
            {
                title: "Controlled publishing",
                description:
                    "Choose where confessions are published and manage submissions that should not be posted.",
            },
        ],
        commands: [
            {
                command: "/confessions submit",
                description:
                    "Submit an anonymous confession.",
            },
            {
                command: "/confessionchanneladd",
                description:
                    "Add a channel for confession publishing.",
            },
            {
                command: "/confessiondeclinedelete",
                description:
                    "Delete a declined confession.",
            },
        ],
    },

    {
        pluginId: "giveaway",
        eyebrow: "COMMUNITY • GIVEAWAYS",
        headline: "Turn a prize into an event.",
        introduction:
            "Run persistent giveaways with configurable entry requirements, weighted participation, finalists, winners, and rerolls.",
        features: [
            {
                title: "Create community events",
                description:
                    "Turn prizes into structured giveaways that your members can participate in.",
            },
            {
                title: "Reward participation",
                description:
                    "Choose how members can qualify for giveaway participation rewards.",
            },
            {
                title: "Keep the outcome flexible",
                description:
                    "Reroll winners or cancel giveaways when circumstances change.",
            },
        ],
        commands: [
            {
                command: "/giveaway start",
                description:
                    "Start a new giveaway.",
            },
            {
                command: "/giveaway config level",
                description:
                    "Configure level rewards for giveaway participation.",
            },
            {
                command: "/giveaway config role",
                description:
                    "Configure role rewards for giveaway participation.",
            },
            {
                command: "/giveaway config remove-level",
                description:
                    "Remove a configured level reward from the giveaway.",
            },
            {
                command: "/giveaway config remove-role",
                description:
                    "Remove a configured role reward from the giveaway.",
            },
            {
                command: "/giveaway config view",
                description:
                    "View the current giveaway configuration.",
            },
            {
                command: "/giveaway reroll",
                description:
                    "Reroll the result of a completed giveaway.",
            },
            {
                command: "/giveaway cancel",
                description:
                    "Cancel an active giveaway.",
            },
        ],
    },

    {
        pluginId: "games",
        eyebrow: "COMMUNITY • GAMES",
        headline: "Give your community something to play.",
        introduction:
            "Bring quick games directly into your Discord server with a collection of simple, interactive experiences built into Quill & Ink.",
        features: [
            {
                title: "Quick to start",
                description:
                    "Give members games they can jump into without leaving Discord.",
            },
            {
                title: "Something for everyone",
                description:
                    "Choose between different styles of short-form games and challenges.",
            },
            {
                title: "Built into Quill & Ink",
                description:
                    "Keep casual games alongside the rest of your community systems.",
            },
        ],
        commands: [
            {
                command: "/slots",
                description:
                    "Play the Quill & Ink slots game.",
            },
            {
                command: "/dice",
                description:
                    "Play the dice game.",
            },
            {
                command: "/odd-even",
                description:
                    "Play the odd-or-even game.",
            },
            {
                command: "/rps",
                description:
                    "Play Rock Paper Scissors.",
            },
        ],
    },

    {
        pluginId: "tcg",
        eyebrow: "COMMUNITY • CARD GAME",
        headline: "Take your seat at the table.",
        introduction:
            "A two-player trading card game built directly into Quill & Ink, with players facing each other across a shared game table.",
        features: [
            {
                title: "Two-player matches",
                description:
                    "Create a table where two players can face off against each other.",
            },
            {
                title: "Cards with effects",
                description:
                    "Use cards with different effects to shape the course of a match.",
            },
            {
                title: "Play directly in Discord",
                description:
                    "Keep the game inside your server instead of sending players somewhere else.",
            },
        ],
        commands: [
            {
                command: "/tcg",
                description:
                    "Create a TCG table and begin setting up a match.",
            },
            {
                command: "/tcgremove",
                description:
                    "Remove a TCG table.",
            },
        ],
    },

    {
        pluginId: "robbery",
        eyebrow: "COMMUNITY • INTERACTIVE",
        headline: "Sometimes the biggest reward comes with a price.",
        introduction:
            "A robbery system where members can attempt to steal Nickel from others, with a built-in police response that adds another layer of interaction.",
        features: [
            {
                title: "A risky way to earn Nickel",
                description:
                    "Give members the chance to steal Nickel from other members.",
            },
            {
                title: "Police response",
                description:
                    "Include a police response system assigned by Quill & Ink to handle robbery attempts.",
            },
            {
                title: "A living economy game",
                description:
                    "Add another layer of interaction to your server's economy and community.",
            },
        ],
        commands: [
            {
                command: "/rob",
                description:
                    "Attempt a robbery.",
            },
            {
                command: "/policeconfig",
                description:
                    "Set the channel where police notifications are sent.",
            },
            {
                command: "/set-police",
                description:
                    "Assign a trusted member to help protect your members from robbers.",
            },
        ],
    },

    {
        pluginId: "store",
        eyebrow: "COMMUNITY • STORE",
        headline: "Give your community something to spend on.",
        introduction:
            "Create a server store where members can spend Nickel on configured items, with staff controls for managing the store.",
        features: [
            {
                title: "Build a server marketplace",
                description:
                    "Create a store containing the items your community can purchase.",
            },
            {
                title: "Use Nickel",
                description:
                    "Connect the store directly to Quill & Ink's economy currency.",
            },
            {
                title: "Control your staff",
                description:
                    "Manage which members and roles can help operate the store.",
            },
        ],
        commands: [
            {
                command: "/store setup",
                description:
                    "Set up the server store.",
            },
            {
                command: "/store edit",
                description:
                    "Edit the server store configuration or contents.",
            },
            {
                command: "/store recover",
                description:
                    "Recover the store configuration while preserving existing items.",
            },
            {
                command: "/store staff member-add",
                description:
                    "Add a member as store staff.",
            },
            {
                command: "/store staff member-remove",
                description:
                    "Remove a member from the store staff.",
            },
            {
                command: "/store staff role-add",
                description:
                    "Add a role as store staff.",
            },
            {
                command: "/store staff role-remove",
                description:
                    "Remove a role from the store staff.",
            },
            {
                command: "/store staff member-list",
                description:
                    "View members assigned as store staff.",
            },
            {
                command: "/store staff role-list",
                description:
                    "View roles assigned as store staff.",
            },
        ],
    },

    {
        pluginId: "anchor",
        eyebrow: "COMMUNITY • MESSAGES",
        headline: "Put your important words somewhere permanent.",
        introduction:
            "Create persistent custom embed messages for your server and give important information a dedicated place to live.",
        features: [
            {
                title: "Persistent messages",
                description:
                    "Create custom embeds designed to remain useful in your server.",
            },
            {
                title: "Server-specific presentation",
                description:
                    "Use custom messages to present information in a way that fits your community.",
            },
            {
                title: "One command to begin",
                description:
                    "Create an Anchor message directly from Discord.",
            },
        ],
        commands: [
            {
                command: "/anchor create",
                description:
                    "Create a persistent custom embed message.",
            },
        ],
    },

    {
        pluginId: "bulletin",
        eyebrow: "COMMUNITY • BULLETIN",
        headline: "Let your community decide what deserves a spotlight.",
        introduction:
            "Save community-nominated messages into a dedicated bulletin channel, giving your server a place for moments worth remembering.",
        features: [
            {
                title: "Community nominations",
                description:
                    "Give members a way to surface messages they believe deserve attention.",
            },
            {
                title: "A dedicated bulletin",
                description:
                    "Keep nominated moments together in a dedicated channel.",
            },
            {
                title: "Make the system yours",
                description:
                    "Configure the channel and emoji used by the bulletin system.",
            },
        ],
        commands: [
            {
                command: "/setbulletinchannel",
                description:
                    "Set the channel used for the bulletin system.",
            },
            {
                command: "/setbulletinemoji",
                description:
                    "Set the emoji used by the bulletin system.",
            },
        ],
    },

    {
        pluginId: "opera-assistant",
        eyebrow: "COMMUNITY • AI ASSISTANT",
        headline: "Give your server a voice of its own.",
        introduction:
            "Meet Opera Assistant, Quill & Ink's AI-powered Discord companion. She can respond conversationally using knowledge configured for your server, helping members get useful answers in a more personal way.",
        features: [
            {
                title: "Natural AI conversations",
                description:
                    "Give members a conversational assistant that can respond to their questions. Start a conversation by saying 'Hey Quill' or 'Hey Ink'.",
            },
            {
                title: "Knowledge shaped by your server",
                description:
                    "Add, retrieve, list, and remove server-specific knowledge used by the assistant.",
            },
            {
                title: "A companion for your community",
                description:
                    "Bring a more personal AI assistant experience into your Discord server.",
            },
        ],
        commands: [
            {
                command: "/assistant-knowledge set",
                description:
                    "Add knowledge to the server assistant.",
            },
            {
                command: "/assistant-knowledge delete",
                description:
                    "Remove stored assistant knowledge.",
            },
            {
                command: "/assistant-knowledge get",
                description:
                    "Retrieve stored assistant knowledge.",
            },
            {
                command: "/assistant-knowledge list",
                description:
                    "List the knowledge currently stored for the assistant.",
            },
        ],
    },

    {
        pluginId: "economy",
        eyebrow: "ECONOMY • NICKEL",
        headline: "Give your community an economy worth living in.",
        introduction:
            "Build a persistent server economy around Nickel, daily rewards, transfers, banking, and a secure place to store your wealth. With resources that are limited, members have more reasons to manage their finances carefully.",
        features: [
            {
                title: "Nickel for your community",
                description:
                    "Give members a persistent currency they can earn, hold, transfer, and spend.",
            },
            {
                title: "More than a wallet",
                description:
                    "Connect everyday earnings with banking and the wider Quill & Ink economy.",
            },
            {
                title: "A living economy",
                description:
                    "Create an economy that supports rewards, stores, games, and other community systems while encouraging members to manage limited resources.",
            },
        ],
        commands: [
            {
                command: "/bankinfo",
                description:
                    "View information about your server's InkBank and its available reserve.",
            },
            {
                command: "/economy earn nickel",
                description:
                    "Manage or configure where Nickel can be earned.",
            },
            {
                command: "/economy reset",
                description:
                    "Reset the server economy. Use this only when you fully understand the consequences.",
            },
            {
                command: "/daily",
                description:
                    "Claim the daily economy reward.",
            },
            {
                command: "/daily config",
                description:
                    "Configure the daily reward system.",
            },
            {
                command: "/give",
                description:
                    "Give Nickel to a member using the server's InkBank.",
            },
            {
                command: "/locker deposit",
                description:
                    "Deposit Nickel into the bank locker, which supports interest and fixed deposits.",
            },
            {
                command: "/locker withdraw",
                description:
                    "Withdraw Nickel from the bank locker.",
            },
            {
                command: "/pay",
                description:
                    "Transfer Nickel to another member.",
            },
            {
                command: "/bank",
                description:
                    "Transfer Nickel between members across different servers.",
            },
        ],
    },

    // GLOBAL SYSTEMS — NOT PLUGINS

    {
        pluginId: "global-collaboration",
        eyebrow: "GLOBAL • COLLABORATION",
        headline: "Bring communities together, one collaboration at a time.",
        introduction:
            "Connect different Quill & Ink servers through organised collaborations. Create an invitation, share your plans, welcome participating communities, and communicate through dedicated private channels.",
        features: [
            {
                title: "Create collaboration invitations",
                description:
                    "Publish an invitation describing your server, the purpose of the collaboration, your plan, duration, prize or reward, and expected contribution.",
            },
            {
                title: "Choose your collaboration limits",
                description:
                    "Set an invitation expiry period and the maximum number of participating servers.",
            },
            {
                title: "Controlled participation",
                description:
                    "Server administrators and members with Manage Server permission can create and join collaboration invitations on behalf of their servers.",
            },
            {
                title: "Dedicated private channels",
                description:
                    "Participating servers receive private collaboration channels where authorised participants can communicate.",
            },
            {
                title: "Cross-server communication",
                description:
                    "Messages sent in an active collaboration channel are relayed to the other participating servers, making coordination easier.",
            },
            {
                title: "Time-limited invitations",
                description:
                    "Invitations automatically expire when their configured expiry time is reached. Expired invitations can no longer accept participants.",
            },
        ],
        commands: [
            {
                command: "/collab",
                description:
                    "Create and publish a collaboration invitation. Configure the server name, description, purpose, plan, duration, prize, contribution, expiry period, and maximum participating servers.",
            },
        ],
    },

    {
        pluginId: "inkbank",
        eyebrow: "GLOBAL • SERVER ECONOMY",
        headline: "Every community has a reserve of its own.",
        introduction:
            "Every Quill & Ink server has its own InkBank, providing a shared reserve for that server's economy. InkBank does not independently mint Nickel. Its allocations are funded through the shared Quill Bank, which uses its existing reserves first and covers any shortfall before the Nickel is allocated.",
        features: [
            {
                title: "A dedicated reserve for every server",
                description:
                    "Each server receives its own InkBank, keeping its economy reserve separate from the reserves of other servers.",
            },
            {
                title: "Member-based allocation",
                description:
                    "When a server is initially funded, its allocation is based on its current membership. For each member, the allocation is 10,000 Nickel.",
            },
            {
                title: "New members contribute to the reserve",
                description:
                    "When a new member joins a server, 10,000 Nickel is allocated to that server's InkBank through the shared Quill Bank.",
            },
            {
                title: "Departures return Nickel",
                description:
                    "When a member leaves, up to 10,000 Nickel is returned from the server's InkBank to the shared Quill Bank. If the InkBank cannot provide the full amount, the remaining return is tracked separately.",
            },
            {
                title: "A recovery period for returning members",
                description:
                    "A departed member's eligible wallet and locker balances are preserved for three months. If they return within that period, those balances can be restored.",
            },
            {
                title: "Unclaimed funds return to the shared reserve",
                description:
                    "After the three-month recovery period, unclaimed departed-member wallet and locker funds expire and return to the Quill Bank.",
            },
        ],
        commands: [],
    },

    {
        pluginId: "automod",
        eyebrow: "MODERATION • PROTECTION",
        headline: "Let your server protect itself.",
        introduction:
            "Automatic moderation tools designed to help communities handle unwanted content and maintain a safer everyday environment.",
        features: [
            {
                title: "Automatic protection",
                description:
                    "Let moderation rules respond to unwanted activity without requiring staff to watch every message.",
            },
            {
                title: "Less repetitive work",
                description:
                    "Reduce the amount of routine moderation your staff needs to handle manually.",
            },
            {
                title: "Part of your moderation layer",
                description:
                    "Use automatic protection alongside Quill & Ink's other moderation systems.",
            },
        ],
        commands: [],
    },

    {
        pluginId: "logging",
        eyebrow: "MODERATION • LOGGING",
        headline: "Keep a record of what happens.",
        introduction:
            "Track important server and moderation events through a configurable logging system designed to give staff better visibility.",
        features: [
            {
                title: "Know what happened",
                description:
                    "Keep useful records of important events happening across your server.",
            },
            {
                title: "Choose your logging setup",
                description:
                    "Configure the logging system around the channels and events your staff needs to monitor.",
            },
            {
                title: "Better moderation visibility",
                description:
                    "Give your staff a clearer history when investigating server activity.",
            },
        ],
        commands: [
            {
                command: "/logging set",
                description:
                    "Configure where the logging output is sent.",
            },
            {
                command: "/logging disable",
                description:
                    "Disable server logging.",
            },
            {
                command: "/logging view",
                description:
                    "View the current logging configuration.",
            },
        ],
    },

    {
        pluginId: "moderation",
        eyebrow: "MODERATION • SERVER MANAGEMENT",
        headline: "Keep order without losing the human side.",
        introduction:
            "A collection of everyday moderation and server-management tools for handling members, messages, channels, warnings, and timeouts.",
        features: [
            {
                title: "Everyday moderation",
                description:
                    "Handle common moderation actions from a single system.",
            },
            {
                title: "Keep a clear record",
                description:
                    "Use cases, warnings, and moderation logs to keep staff actions organised.",
            },
            {
                title: "Control your server",
                description:
                    "Manage messages, channels, slowmode, locks, and member access when needed.",
            },
        ],
        commands: [
            {
                command: "/setmodlogs",
                description:
                    "Configure the channel where moderation logs are sent.",
            },
            {
                command: "/case",
                description:
                    "View a moderation case.",
            },
            {
                command: "/ban",
                description:
                    "Ban a member from the server.",
            },
            {
                command: "/unban",
                description:
                    "Remove a member's server ban.",
            },
            {
                command: "/kick",
                description:
                    "Kick a member from the server.",
            },
            {
                command: "/warn",
                description:
                    "Issue a warning to a member.",
            },
            {
                command: "/warnings",
                description:
                    "View a member's warnings.",
            },
            {
                command: "/clearwarnings",
                description:
                    "Clear a member's warnings.",
            },
            {
                command: "/timeout",
                description:
                    "Timeout a member.",
            },
            {
                command: "/untimeout",
                description:
                    "Remove a member's timeout.",
            },
            {
                command: "/lock",
                description:
                    "Lock a channel.",
            },
            {
                command: "/unlock",
                description:
                    "Unlock a channel.",
            },
            {
                command: "/purge",
                description:
                    "Bulk-delete messages from a channel.",
            },
            {
                command: "/slowmode",
                description:
                    "Configure channel slowmode.",
            },
        ],
    },

    {
        pluginId: "tickets",
        eyebrow: "MODERATION • SUPPORT",
        headline: "Give every problem a proper door.",
        introduction:
            "A simple support ticket system that gives members a private way to ask for help while keeping the process organised for staff.",
        features: [
            {
                title: "Private support",
                description:
                    "Give members a dedicated place to discuss issues that should not happen in public channels.",
            },
            {
                title: "Simple workflow",
                description:
                    "Keep ticket creation and closing straightforward for members and staff.",
            },
            {
                title: "Built into Discord",
                description:
                    "Handle support without sending your community to another platform.",
            },
        ],
        commands: [
            {
                command: "/ticket create",
                description:
                    "Create a support ticket.",
            },
            {
                command: "/ticket close",
                description:
                    "Close an active support ticket.",
            },
        ],
    },

    {
        pluginId: "premium-tickets",
        eyebrow: "MODERATION • PREMIUM SUPPORT",
        headline: "Build a support system around your community.",
        introduction:
            "Advanced private support tickets with persistent configuration for categories, staff roles, and individual staff members.",
        features: [
            {
                title: "Structured support",
                description:
                    "Organise support around configurable ticket categories.",
            },
            {
                title: "Flexible staff access",
                description:
                    "Control ticket access using both staff roles and individual members.",
            },
            {
                title: "Persistent configuration",
                description:
                    "Keep your support setup configured for the way your server operates.",
            },
        ],
        commands: [
            {
                command: "/premium-ticket setup",
                description:
                    "Set up the channel where the Premium Tickets panel is created.",
            },
            {
                command: "/premium-ticket category add",
                description:
                    "Add a ticket category.",
            },
            {
                command: "/premium-ticket category remove",
                description:
                    "Remove a ticket category.",
            },
            {
                command: "/premium-ticket category list",
                description:
                    "List the configured ticket categories.",
            },
            {
                command: "/premium-ticket staff role add",
                description:
                    "Add a staff role to the Premium Tickets system.",
            },
            {
                command: "/premium-ticket staff role remove",
                description:
                    "Remove a staff role from the Premium Tickets system.",
            },
            {
                command: "/premium-ticket staff role list",
                description:
                    "List the staff roles configured for Premium Tickets.",
            },
            {
                command: "/premium-ticket staff member add",
                description:
                    "Add an individual staff member to the Premium Tickets system.",
            },
            {
                command: "/premium-ticket staff member remove",
                description:
                    "Remove an individual staff member from the Premium Tickets system.",
            },
            {
                command: "/premium-ticket staff member list",
                description:
                    "List the individual staff members configured for Premium Tickets.",
            },
        ],
    },

    {
        pluginId: "auto-roles",
        eyebrow: "MODERATION • ROLES",
        headline: "Give new members a place to start.",
        introduction:
            "Automatically assign configured roles to members when they join your server, with simple controls for managing the setup.",
        features: [
            {
                title: "Automatic role assignment",
                description:
                    "Give members configured roles without requiring staff to assign them manually.",
            },
            {
                title: "Simple configuration",
                description:
                    "Set, view, and disable the automatic role system directly from Discord.",
            },
            {
                title: "Consistent onboarding",
                description:
                    "Make sure new members receive the roles your server expects them to have.",
            },
        ],
        commands: [
            {
                command: "/autorole set",
                description:
                    "Set the role automatically assigned to members.",
            },
            {
                command: "/autorole disable",
                description:
                    "Disable automatic role assignment.",
            },
            {
                command: "/autorole view",
                description:
                    "View the current automatic role configuration.",
            },
        ],
    },

    {
        pluginId: "pressure",
        eyebrow: "COMMUNITY • PREMIUM GAME",
        headline: "Put something on the line.",
        introduction:
            "A multiplayer wagered card game for Quill & Ink, built around competitive play and stakes between players.",
        features: [
            {
                title: "Multiplayer competition",
                description:
                    "Bring multiple players together for a competitive card-game experience.",
            },
            {
                title: "Put something at stake",
                description:
                    "Use wagers to give matches an additional layer of tension.",
            },
            {
                title: "Play inside Discord",
                description:
                    "Create a persistent game table in a text channel, with access restricted to the participating players.",
            },
        ],
        commands: [
            {
                command: "/pressure",
                description:
                    "Create a persistent table in a text channel where players can join.",
            },
            {
                command: "/pressure remove",
                description:
                    "Remove a persistent table from a text channel.",
            },
        ],
    },

    {
        pluginId: "voice",
        eyebrow: "COMMUNITY • VOICE",
        headline: "Give conversations a room of their own.",
        introduction:
            "Temporary voice channel management for Quill & Ink, allowing members to create voice spaces when they need them.",
        features: [
            {
                title: "Temporary voice spaces",
                description:
                    "Instead of creating many permanent voice channels, let members create temporary ones when needed.",
            },
            {
                title: "Simple member experience",
                description:
                    "Let members create a temporary voice space whenever they need one.",
            },
            {
                title: "Keep voice channels flexible",
                description:
                    "Create one voice channel named 'Create Voice Channel' and let Quill & Ink manage the temporary channels.",
            },
        ],
        commands: [],
    },
];