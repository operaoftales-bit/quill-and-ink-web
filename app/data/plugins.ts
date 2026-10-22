
export type CategoryId =
  | "community"
  | "economy"
  | "global"
  | "moderation";

export type PluginTier = "Basic" | "Premium";

export type PluginStatus = "available" | "unavailable";

export type Plugin = {
  id: string;
  name: string;
  category: CategoryId;
  tier: PluginTier;
  description?: string;
  tag?: string;
  status?: PluginStatus;
  commands?: string[];
};

export const categories = [
  {
    id: "community",
    name: "Community",
    description:
      "Features that help your community grow, engage, participate, and create experiences together.",
  },
  {
    id: "economy",
    name: "Economy",
    description:
      "Persistent systems that give your community a currency, rewards, progression, and ways to spend."
  },
  {
    id: "global",
    name: "Global",
    description:
      "Core systems that connect your server to the wider Quill & Ink experience.",
  },
  {
    id: "moderation",
    name: "Moderation",
    description:
      "Protection, moderation, logging, and server-management tools built for everyday communities.",
    
  },
];

export const plugins: Plugin[] = [
  // Community
  {
    id: "leveling",
    name: "Leveling",
    category: "community",
    tier: "Basic",
    description: "XP and leveling system for Quill & Ink",
    tag: "Level",
    commands: [
      "/leveling preview",
      "/leveling image",
      "/leveling color",
      "/leveling message",
      "/leveling thumbnail",
      "/leveling channel",
      "/leveling enable",
      "/leveling disable",
      "/leveling title",
      "/leveling timestamp",
      "/leveling footer",
      "/levelroleconfig",
    ],
  },
  {
    id: "reactionroles",
    name: "Reaction Roles",
    category: "community",
    tier: "Basic",
    description: "Give and remove Discord roles using reactions.",
    tag: "Roles",
    commands: [
        "/setreactionrole",
    ]
  },
  {
    id: "welcome",
    name: "Welcome",
    category: "community",
    tier: "Basic",
    description: "Welcome and leave messages for Discord servers.",
  
    tag: "Welcome",
    commands: [
        "/welcome message",
        "/welcome dmmessage",
        "/welcome set",
        "/welcome preview",
        "/welcome dm",
        "/welcome disable",
        "/welcome view",
    ]
  },
  {
    id: "birthday",
    name: "Birthday Tracker",
    category: "community",
    tier: "Basic",
    description:
      "Birthday tracking with timezone-aware reminders, announcements, roles, DMs, and optional gifts.",
  
    tag: "Birthday",
    commands: [
        "/birthday list",
        "/birthday config timezone",
        "/birthday config view",
        "/birthday view",
        "/birthday config announcement",
        "/birthday config role",
        "/birthday config dm",
        "/birthday config prize",
        "/birthday config enable",
        "/birthday set",
        "/birthday remove",
    ],
  },
  {
    id: "confessions",
    name: "Confessions",
    category: "community",
    tier: "Basic",
    description:
      "Anonymous confession submissions with private moderation and public publishing.",

    tag: "Confessions",
    commands: [
        "/confessions submit",
        "/confessionchanneladd",
        "/confessiondeclinedelete"
    ]
  },
  {
    id: "giveaway",
    name: "Giveaway",
    category: "community",
    tier: "Premium",
    description:
      "Persistent giveaways with weighted entries, finalists, winners and rerolls.",
    tag: "Giveaway",
    commands:[
        "/giveaway start",
        "/giveaway config level",
        "/giveaway config role",
        "/giveaway config remove-level",
        "/giveaway config remove-role",
        "/giveaway config view",
        "/giveaway reroll",
        "/giveaway cancel"

        ]
  },
  {
    id: "games",
    name: "Games",
    category: "community",
    tier: "Basic",
    description: "Games and gambling system for Quill & Ink",
    
    tag: "Game",
    commands:[
        "/slots",
        "/dice",
        "/odd-even",
        "/rps"
    ]
  },
  {
    id: "tcg",
    name: "TCG",
    category: "community",
    tier: "Basic",
    description: "Two-player Quill & Ink Trading Card Game",
    
    tag: "Game",
    commands:[
        "/tcg",
        "/tcgremove",

    ]
  },
  {
    id: "robbery",
    name: "Robbery",
    category: "community",
    tier: "Premium",
    description: "A premium high-risk robbery system for Quill & Ink.",
    
    tag: "Game",
    commands:[
        "/rob",
        "/policeconfig",
        "/set-police"
    ]
  },
  {
    id: "store",
    name: "Store",
    category: "community",
    tier: "Basic",
    description:
      "Server stores with Nickel purchases and configurable Store staff.",
    
    tag: "Store",
    commands:[
        "/store setup",
        "/store edit",
        "/store recover",
        "/store staff member-add",
        "/store staff member-remove",
        "/store staff role-add",
        "/store staff role-remove",
        "/store staff member-list",
        "/store staff role-list"
    ]
  },
  {
    id: "anchor",
    name: "Anchor",
    category: "community",
    tier: "Premium",
    description: "Create persistent custom embed messages for your server.",
    
    commands:[
        "/anchor create"
    ]
  },
  {
    id: "bulletin",
    name: "Bulletin",
    category: "community",
    tier: "Premium",
    description:
      "Save community-nominated messages in a bulletin channel.",
    
    commands:[
        "/setbulletinchannel",
        "/setbulletinemoji"
    ]
  },
  {
    id: "opera-assistant",
    name: "Opera Assistant",
    category: "community",
    tier: "Premium",
    description:
      "A modular AI-powered server assistant for Quill & Ink.",
    
    tag: "AI Assistant",
    commands:[
        "/assistant-knowledge set",
        "/assistant-knowledge delete",
        "/assistant-knowledge get",
        "/assistant-knowledge list"
    ]
  },

  // Economy
  {
    id: "economy",
    name: "Economy",
    category: "economy",
    tier: "Basic",
    description: "Economy system for Quill & Ink",
    
    tag: "Economy",
    commands:[
        "/bankinfo",
        "/economy earn nickel",
        "/economy reset",
        "/daily",
        "/daily config",
        "/give",
        "/locker deposit",
        "/locker withdraw",
        "/pay",
        "/bank"
    ]
  },

  // Global
  // Global is a category/core system, not a plugin.

  // Moderation
  {
    id: "automod",
    name: "AutoMod",
    category: "moderation",
    tier: "Basic",
    description: "Automatic moderation tools for Quill & Ink",
    
    tag: "Moderation",
    
  },
  {
    id: "logging",
    name: "Logging",
    category: "moderation",
    tier: "Basic",
    description: "Server event and moderation logging.",
    
    tag: "Logging",
    commands:[
        "/logging set",
        "/logging disable",
        "/logging view"
    ]
  },
  {
    id: "moderation",
    name: "Moderation",
    category: "moderation",
    tier: "Basic",
    description: "Moderation tools for managing Discord servers.",
    
    tag: "Moderation",
    commands:[
        "/setmodlogs",
        "/case",
        "/ban",
        "/unban",
        "/kick", 
        "/warn",
        "/warnings",
        "/clearwarnings",
        "/timeout",
        "/untimeout",
        "/lock",
        "/unlock",
        "/purge",
        "/slowmode"
    ]
  },
  {
    id: "tickets",
    name: "Tickets",
    category: "moderation",
    tier: "Basic",
    description: "Simple support ticket system for Quill & Ink",
    
    tag: "Ticket",
    commands:[
        "/ticket create",
        "/ticket close",
    ]
  },
  {
    id: "premium-tickets",
    name: "Premium Tickets",
    category: "moderation",
    tier: "Premium",
    description:
      "Advanced private support tickets with persistent configuration.",
    
    tag: "Ticket",
    commands:[
        "/premium-ticket setup",
        "/premium-ticket category add",
        "/premium-ticket category remove",
        "/premium-ticket category list",
        "/premium-ticket staff role add",
        "/premium-ticket staff role remove",
        "/premium-ticket staff role list",
        "/premium-ticket staff member add",
        "/premium-ticket staff member remove",
        "/premium-ticket staff member list",
    ]
  },
  {
    id: "auto-roles",
    name: "Auto Roles",
    category: "moderation",
    tier: "Basic",

    tag: "Roles",
    commands:[
        "/autorole set",
        "/autorole disable",
        "/autorole view",
    ]
  },

  // Premium-tier plugins
  {
    id: "pressure",
    name: "Pressure",
    category: "community",
    tier: "Premium",
    description: "Multiplayer wagered card game for Quill & Ink",
    
    tag: "Game",
    commands:[
        "/pressure",
        "/pressure remove",
    ]
  },
  {
    id: "voice",
    name: "Voice",
    category: "community",
    tier: "Premium",
    description:
      "Temporary voice channel management for Quill & Ink use, 'Create Voice Channel' to create a temporary voice channel.",
    
    tag: "Voice",
  },
];
