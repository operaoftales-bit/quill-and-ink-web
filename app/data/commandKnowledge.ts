
export type CommandKnowledge = {
  name: string;
  description: string;
  usage: string;
  category: string;
  aliases?: string[];
  details?: string[];
  example?: {
    input: string;
    response: string;
  };
  discordDemo?: {
    color: number;
    author: string;
    title: string;
    description: string;
    fields?: {
      name: string;
      value: string;
      inline?: boolean;
    }[];
    footer?: string;
    errors?: {
      condition: string;
      response: string;
    }[];
  };
};

export const commandKnowledge: CommandKnowledge[] = [
  {
    name: "daily",
    description: "Claim your daily Nickel reward.",
    usage: "/daily",
    category: "Economy",

    details: [
      "Can only be used inside a Discord server.",
      "Claims a daily reward funded by the server's Ink Bank.",
      "Creates an economy account if the member does not have one.",
      "The default starting reward is 10 Nickel.",
      "The default reward increment is 2 Nickel.",
      "Reward progression can use ADD or MULTIPLY mode.",
      "The server can configure the increasing and decreasing phases.",
      "Claiming again on the same calendar day is rejected.",
      "A consecutive-day claim increases the streak; otherwise, it resets to day 1.",
      "Rewards cannot be claimed if the Ink Bank is missing or has insufficient funds.",
      "The successful response includes the reward, streak, and a randomly selected daily quote.",
      "The response is ephemeral, so it is visible only to the command user."
    ],

    example: {
      input: "/daily",
      response:
        "✦ Your Daily Reward\n" +
        "Welcome back, YourDisplayName.\n" +
        "Your reward has been added to your wallet.\n" +
        "🎁 Reward: 10 Nickel\n" +
        "🔥 Streak: 1 day\n" +
        "“Every new day is another page waiting to be written.”"
    },

    discordDemo: {
      color: 0xC9A227,
      author: "QUILL & INK  •  DAILY",
      title: "✦ Your Daily Reward",
      description:
        "Welcome back, @user .\n" +
        "Your reward has been added to your wallet.",
      fields: [
        {
          name: "🎁 Reward",
          value: "10 Nickel",
          inline: true
        },
        {
          name: "🔥 Streak",
          value: " 1 day",
          inline: true
        }
      ],
      footer: "“{dailyQuote}”",

      errors: [
        {
          condition: "Used outside a server",
          response:
            "❌ This command can only be used in a server."
        },
        {
          condition: "Database service unavailable",
          response:
            "❌ Database service is currently unavailable."
        },
        {
          condition: "Already claimed today; fallback response",
          response:
            "⏰ You've already claimed today's daily reward. Come back tomorrow to continue your streak."
        },
        {
          condition: "Ink Bank unavailable",
          response:
            "❌ This server's Ink Bank is unavailable. Please contact an administrator."
        },
        {
          condition: "Ink Bank has insufficient funds",
          response:
            "❌ The server's Ink Bank does not currently have enough Nickel to fund today's reward."
        },
        {
          condition: "Invalid reward configuration",
          response:
            "❌ The server's daily reward configuration produced an invalid reward."
        },
        {
          condition: "Unexpected processing error",
          response:
            "❌ Something went wrong while processing your daily reward."
        }
      ]
    }
  },

{
    name: "card",
    description: "View and manage your Opera Card.",
    usage: "/card",
    category: "Economy",

    details: [
      "Can only be used inside a Discord server.",
      "Requires the database service and Opera Card account service.",
      "Creates or retrieves your global Opera Card.",
      "Displays your global Opera Card balance and current server wallet balance.",
      "The card balance is global, while the wallet balance belongs to the current server.",
      "The response is ephemeral, so it is visible only to the command user.",
      "The Transfer from Wallet button opens the wallet transfer interaction."
    ],

    example: {
      input: "/card",
      response:
        "✦ Opera Card\n" +
        "Your global Nickel reserve, YourDisplayName.\n" +
        "💳 Card Balance: 5,000 Nickel\n" +
        "◇ Server Wallet: 1,200 Nickel" 
    },

    discordDemo: {
      color: 0xC9A227,
      author: "QUILL & INK  •  OPERA BANKING",
      title: "✦ Opera Card",
      description:
        "Your global Nickel reserve, @user.",
      fields: [
        {
          name: "💳 Card Balance",
          value: "200 Nickel",
          inline: true
        },
        {
          name: "◇ Server Wallet",
          value: "50 Nickel",
          inline: true
        }
      ],
      footer: "Opera Card • 1234567890098765432112345",

      errors: [
        {
          condition: "Used outside a server",
          response:
            "❌ This command can only be used in a server."
        },
        {
          condition: "Banking service unavailable",
          response:
            "❌ Banking service is currently unavailable."
        },
        {
          condition: "Card could not be created or retrieved",
          response:
            "❌ Your Opera Card could not be created or retrieved."
        },
        {
          condition: "Unexpected processing error",
          response:
            "❌ Something went wrong while opening your Opera Card."
        }
      ]
    }
  },
  {
  name: "locker",
  description: "View your Bank Locker.",
  usage: "/locker",
  category: "Economy",

  details: [
    "Can only be used inside a Discord server.",
    "Requires the economyAccountService to be available.",
    "Loads your Bank Locker for the current server and your Discord account.",
    "Displays the total Nickel balance held in the locker and its capacity.",
    "Shows a 20-character progress bar representing locker capacity usage, clamped between 0% and 100%.",
    "Displays the total amount currently withdrawable from matured deposits.",
    "Displays the combined interest that active deposits can earn at maturity; this is not daily accrued interest.",
    "Shows the remaining available locker capacity.",
    "Displays the next withdrawal status: available now, the next deposit's maturity time, or nothing currently locked.",
    "Lists up to five deposits that have not yet matured, ordered by maturity time.",
    "Deposit maturity times use Discord's timestamp formatting.",
    "The response is ephemeral, so it is visible only to the command user.",
    "A missing economy service or an unexpected processing error prevents the locker from being displayed."
  ],

  example: {
    input: "/locker",
    response:
      "🔒 Bank Locker\n" +
      "Your Nickel is safely locked away, YourDisplayName.\n\n" +
      "1,000 / 5,000 Nickel\n" +
      "████░░░░░░░░░░░░░░░░ 20%\n\n" +
      "💰 Withdrawable: 0 Nickel\n" +
      "📈 Interest: +20 Nickel at maturity\n" +
      "📦 Available Space: 4,000 Nickel\n" +
      "⏳ Next Withdrawal: Tomorrow\n" +
      "⏳ Upcoming: 1,000 Nickel → Tomorrow"
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  BANKING",
    title: "🔒 Bank Locker",
    description:
      "Your Nickel is safely locked away, @user.\n\n" +
      "1,000 / 5,000 Nickel \n" +
      "████░░░░░░░░░░░░░░░░ 20%",
    fields: [
      {
        name: "💰 Withdrawable",
        value: "0 Nickel",
        inline: true
      },
      {
        name: "📈 Interest",
        value: "+20 Nickel at maturity",
        inline: true
      },
      {
        name: "📦 Available Space",
        value: "4,000 Nickel",
        inline: true
      },
      {
        name: "⏳ Next Withdrawal",
        value: "Tomorrow",
        inline: false
      },
      {
        name: "⏳ Upcoming",
        value: "• 1,000 Nickel → Tomorrow",
        inline: false
      }
    ],
    footer: "Quill & Ink • Bank Locker",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      },
      {
        condition: "Economy service unavailable",
        response:
          "❌ Economy service is currently unavailable."
      },
      {
        condition: "Unexpected processing error",
        response:
          "❌ Something went wrong while opening your Bank Locker. Please try again."
      }
    ]
  }
},
{
  name: "lockerdeposit",
  description: "Deposit Nickel into your Bank Locker.",
  usage: "/lockerdeposit amount:<amount>",
  category: "Economy",

  details: [
    "Can only be used inside a Discord server.",
    "Requires the amount option, which must be an integer of at least 1.",
    "Converts the requested amount to an integer Nickel value before processing.",
    "Requires the economyAccountService to be available.",
    "Deposits Nickel into the current server's Bank Locker through the economy account service.",
    "The service determines the accepted deposit amount, resulting locker balance, and maturity time.",
    "Displays the deposited amount, resulting locker balance, and the time when the deposit becomes available.",
    "Displays the maturity interest estimate as 2% of the requested amount, using integer division and rounding down.",
    "The success response includes Discord-formatted absolute and relative maturity timestamps.",
    "The response is ephemeral, so it is visible only to the command user.",
    "If the deposit fails, the command advises checking wallet balance and available locker space."
  ],

  example: {
    input: "/lockerdeposit amount:1000",
    response:
      "🔒 Nickel Locked\n" +
      "1,000 Nickel has been placed into your Bank Locker.\n" +
      "💰 Deposited: 1,000 Nickel\n" +
      "🔒 Locker Balance: 2,000 Nickel\n" +
      "⏳ Available: [Maturity date and time]\n" +
      "📈 Interest: +20 Nickel at maturity"
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  BANKING",
    title: "🔒 Nickel Locked",
    description:
      "1,000 Nickel has been placed into your Bank Locker.",
    fields: [
      {
        name: "💰 Deposited",
        value: "1,000 Nickel",
        inline: true
      },
      {
        name: "🔒 Locker Balance",
        value: "2,000 Nickel",
        inline: true
      },
      {
        name: "⏳ Available",
        value: "At the deposit's maturity time",
        inline: false
      },
      {
        name: "📈 Interest",
        value: "+20 Nickel at maturity",
        inline: false
      }
    ],
    footer: "Quill & Ink • Bank Locker",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      },
      {
        condition: "Amount is below 1",
        response:
          "The amount must be at least 1 Nickel."
      },
      {
        condition: "Economy service unavailable",
        response:
          "❌ Economy service is currently unavailable."
      },
      {
        condition: "Deposit fails, including insufficient wallet balance or locker space",
        response:
          "❌ Your Nickel could not be deposited into the Bank Locker. Please check your wallet balance and available locker space."
      }
    ]
  }
},
{
  name: "lockerwithdraw",
  description: "Withdraw Nickel from a matured Bank Locker deposit.",
  usage: "/lockerwithdraw deposit:<deposit number>",
  category: "Economy",

  details: [
    "Can only be used inside a Discord server.",
    "Requires the deposit option, which must be an integer of at least 1.",
    "Requires the economyAccountService to be available.",
    "Loads the current server's Bank Locker and retrieves deposits that have not already been withdrawn.",
    "Orders eligible deposits by maturity time, earliest first, before selecting the requested one-based deposit index.",
    "The selected deposit must exist and must have matured before withdrawal can proceed.",
    "If the selected deposit has not matured, the command displays its relative maturity time and leaves it locked.",
    "Withdraws the selected matured deposit through the economy account service.",
    "Displays the returned principal, interest, and total credited to the wallet.",
    "The response is ephemeral, so it is visible only to the command user.",
    "The current /locker display does not number deposits, although this command expects a deposit number; selection follows the sorted, non-withdrawn deposit list.",
    "An unexpected withdrawal error produces a generic failure response and directs the user to check /locker."
  ],

  example: {
    input: "/lockerwithdraw deposit:1",
    response:
      "💰 Locker Withdrawal\n" +
      "Your matured Nickel has been returned to your wallet, YourDisplayName.\n" +
      "💰 Principal: 1,000 Nickel\n" +
      "📈 Interest: +20 Nickel\n" +
      "💵 Total: 1,020 Nickel"
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  BANKING",
    title: "💰 Locker Withdrawal",
    description:
      "Your matured Nickel has been returned to your wallet, @user.",
    fields: [
      {
        name: "💰 Principal",
        value: "1,000 Nickel",
        inline: true
      },
      {
        name: "📈 Interest",
        value: "+20 Nickel",
        inline: true
      },
      {
        name: "💵 Total",
        value: "1,020 Nickel",
        inline: true
      }
    ],
    footer: "Quill & Ink • Bank Locker",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      },
      {
        condition: "Economy service unavailable",
        response:
          "❌ Economy service is currently unavailable."
      },
      {
        condition: "Deposit index does not identify an active deposit",
        response:
          "❌ That deposit could not be found. Use `/locker` to see your current deposits."
      },
      {
        condition: "Selected deposit has not matured",
        response:
          "⏳ This Nickel is still locked.\n\nYou can withdraw it when the deposit matures."
      },
      {
        condition: "Withdrawal processing fails",
        response:
          "❌ This Bank Locker withdrawal could not be completed. Please use `/locker` to check your deposits and try again."
      }
    ]
  }
},
{
  name: "pay",
  description: "Send Nickel to another member.",
  usage: "/pay member:<member> amount:<amount>",
  category: "Economy",

  details: [
    "Can only be used inside a Discord server.",
    "Requires a member option and an amount option.",
    "The amount must be an integer of at least 1 Nickel.",
    "Rejects payments to yourself and to bot accounts.",
    "The recipient must be a member of the current server.",
    "Requires the database service to be available.",
    "The sender must already have an economy account in the current server.",
    "Automatically creates the recipient's server economy account with a zero Nickel wallet if one does not exist.",
    "Charges a 2% transaction fee, calculated using integer division and rounded down to whole Nickel.",
    "The total amount charged is the requested payment plus the transaction fee.",
    "Uses the sender's current server wallet first, then charges their global Opera Card for any remaining cost.",
    "If the Opera Card is needed but cannot be found, the payment fails.",
    "The sender must have enough combined wallet and Opera Card funds to cover the payment and fee.",
    "Uses a database transaction for account lookup, balance deductions, and recipient wallet crediting.",
    "Conditional balance updates help prevent concurrent transactions from spending the same funds.",
    "The recipient receives the requested payment amount; the transaction fee is not included in the recipient's credit.",
    "The success response shows the recipient, payment amount, fee, total charged, and whichever funding sources were used.",
    "The response is ephemeral, so it is visible only to the command user."
  ],

  example: {
    input: "/pay member:@Alex amount:1000",
    response:
      "💸 Payment Successful\n" +
      "You successfully sent 1,000 Nickel to @Alex.\n" +
      "👤 Recipient: @Alex\n" +
      "💰 Amount Sent: 1,000 Nickel\n" +
      "🧾 Transaction Fee: 20 Nickel\n" +
      "💸 Total Charged: 1,020 Nickel\n" +
      "👛 Wallet: 1,020 Nickel"
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  NICKEL ECONOMY",
    title: "💸 Payment Successful",
    description:
      "You successfully sent 1,000 Nickel to @Alex.",
    fields: [
      {
        name: "👤 Recipient",
        value: "@Alex",
        inline: true
      },
      {
        name: "💰 Amount Sent",
        value: "1,000 Nickel",
        inline: true
      },
      {
        name: "🧾 Transaction Fee",
        value: "20 Nickel",
        inline: true
      },
      {
        name: "💸 Total Charged",
        value: "1,020 Nickel",
        inline: true
      },
      {
        name: "👛 Wallet",
        value: "1,020 Nickel",
        inline: true
      }
    ],
    footer: "Quill & Ink • Nickel Economy",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      },
      {
        condition: "Recipient is the sender",
        response:
          "❌ You cannot pay yourself."
      },
      {
        condition: "Recipient is a bot",
        response:
          "❌ You cannot pay a bot."
      },
      {
        condition: "Recipient is not a member of the server",
        response:
          "❌ That member is not in this server."
      },
      {
        condition: "Database service unavailable",
        response:
          "❌ Database service is unavailable."
      },
      {
        condition: "Sender economy account missing",
        response:
          "❌ Your economy account could not be found. Please use an economy command first to initialize your account."
      },
      {
        condition: "Insufficient wallet funds and Opera Card missing",
        response:
          "❌ You don't have enough Nickel in your wallet, and your Opera Card could not be found to cover the remaining amount."
      },
      {
        condition: "Insufficient combined funds",
        response:
          "❌ You don't have enough Nickel to complete this payment."
      },
      {
        condition: "Unexpected transaction or processing error",
        response:
          "❌ Something went wrong while processing the payment. Please try again."
      }
    ]
  }
},
{
  name: "anchor",
  description: "Create and manage persistent Anchor messages.",
  usage: "/anchor create",
  category: "Community",

  details: [
    "Requires the Manage Server permission by default.",
    "Marked as a premium command.",
    "Can only be used inside a Discord server.",
    "Provides the create subcommand for creating an Anchor message in the current channel.",
    "Opens a modal rather than creating the message immediately.",
    "The modal requires a title of up to 256 characters and a description of up to 4,000 characters.",
    "The title URL is optional and accepts up to 2,048 characters.",
    "The image URL is optional and accepts up to 2,048 characters.",
    "The footer is optional and accepts up to 2,048 characters.",
    "The description field supports links according to its placeholder text.",
    "The modal submission is identified using the custom ID anchor_create:<user ID>.",
    "This command only displays the creation form; the actual saving and publishing behavior depends on the modal submission handler."
  ],

  example: {
    input: "/anchor create",
    response:
      "⚓ Create Anchor\n" +
      "Title: Community Guidelines\n" +
      "Description: Welcome to our community! Please read the rules before participating.\n" +
      "Title URL: https://example.com/rules\n" +
      "Image URL: Optional\n" +
      "Footer: Community Guidelines"
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  ANCHOR",
    title: "⚓ Create Anchor",
    description:
      "Create a persistent Anchor message in this channel.\n\n" +
      "**Title** (required)\n" +
      "Community Guidelines\n\n" +
      "**Description** (required)\n" +
      "Welcome to our community! Please read the rules before participating.\n\n" +
      "**Title URL** (optional)\n" +
      "https://example.com/rules\n\n" +
      "**Image URL** (optional)\n" +
      "Not provided\n\n" +
      "**Footer** (optional)\n" +
      "Community Guidelines",
    footer: "Quill & Ink • Anchor",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      }
    ]
  }
},
{
  name: "birthday",
  description: "Manage birthdays and birthday settings.",
  usage: "/birthday set month:<month> day:<day> [year:<year>]",
  category: "Community",

  aliases: [],

  details: [
    "Can only be used inside a Discord server.",
    "Requires the database service to be available.",
    "Uses BirthdayService for birthday records and server configuration.",
    "All command responses are ephemeral, so they are visible only to the command user.",
    "The set subcommand registers a birthday using a required month from 1 to 12, a required day from 1 to 31, and an optional year from 1 to 9999.",
    "The service validates the birthday, including calendar-date validity, before accepting it.",
    "The view subcommand displays your registered birthday and whether that birthday record is enabled.",
    "The remove subcommand removes your registered birthday from the current server.",
    "The list subcommand displays registered server birthdays, with 10 entries per page and Previous/Next buttons.",
    "Birthday list buttons can only be used by the member who opened the list.",
    "The config enabled subcommand enables or disables birthday processing for the server.",
    "The config timezone subcommand sets the timezone used for birthday processing.",
    "The config announcement subcommand configures birthday announcement enablement, an optional announcement channel, and an optional custom message.",
    "The config role subcommand configures whether a birthday role is enabled and which role is granted.",
    "The config dm subcommand configures birthday direct messages and an optional custom message.",
    "The config prize subcommand configures birthday Nickel rewards, including enablement and an optional positive reward amount.",
    "All configuration subcommands require the Manage Server permission.",
    "The config view subcommand displays the current tracker status, timezone, announcement settings, birthday role, DM settings, and reward settings.",
    "Configuration changes are delegated to BirthdayService. Actual announcement delivery, role assignment, DM delivery, and reward-claim processing are not implemented in this command file.",
    "The registered birthday's enabled status is distinct from the server-wide tracker configuration."
  ],

  example: {
    input: "/birthday set month:10 day:17 year:2005",
    response:
      "Your birthday has been set to October 17, 2005."
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  BIRTHDAY TRACKER",
    title: "Your Birthday",
    description:
      "Your registered birthday is October 17, 2005.",
    fields: [
      {
        name: "Status",
        value: "Enabled",
        inline: true
      }
    ],
    footer: "Quill & Ink • Birthday Tracker",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "This command can only be used inside a server."
      },
      {
        condition: "Database service unavailable",
        response:
          "The birthday database service is currently unavailable."
      },
      {
        condition: "Birthday record not found",
        response:
          "You do not have a birthday registered in this server."
      },
      {
        condition: "Invalid birthday month",
        response:
          "The birthday month must be between 1 and 12."
      },
      {
        condition: "Invalid birthday day",
        response:
          "The birthday day must be between 1 and 31."
      },
      {
        condition: "Invalid calendar date",
        response:
          "That is not a valid calendar date."
      },
      {
        condition: "Invalid birth year",
        response:
          "The birth year must be between 1 and 9999."
      },
      {
        condition: "Invalid timezone",
        response:
          "Please provide a valid non-empty timezone."
      },
      {
        condition: "Announcement enabled without a channel",
        response:
          "You must provide an announcement channel when announcements are enabled."
      },
      {
        condition: "Birthday role enabled without a role",
        response:
          "You must provide a role when the birthday role is enabled."
      },
      {
        condition: "Birthday rewards enabled without a positive amount",
        response:
          "You must provide a positive Nickel amount when birthday rewards are enabled."
      },
      {
        condition: "Birthday DMs enabled without a message",
        response:
          "You must provide a DM message when birthday DMs are enabled."
      },
      {
        condition: "Configuration attempted without Manage Server permission",
        response:
          "You need the Manage Server permission to configure the Birthday Tracker."
      },
      {
        condition: "Unexpected processing error",
        response:
          "Something went wrong while processing the birthday command."
      }
    ]
  }
},
{
  name: "setbulletinchannel",
  description: "Set the channel where bulletin messages are saved.",
  usage: "/setbulletinchannel channel:<channel>",
  category: "Community",

  details: [
    "Requires the Manage Server permission by default.",
    "Marked as a premium command.",
    "Can only be used inside a Discord server.",
    "Requires a channel option.",
    "Only normal server text channels and announcement channels are accepted.",
    "Validates that the selected channel exists in the current server's channel cache and has an accepted channel type.",
    "Requires the database service to be available.",
    "Uses BulletinService to save the selected channel ID for the server.",
    "The command does not itself publish bulletin messages; it configures the channel used by the bulletin system.",
    "The success response mentions the selected channel.",
    "Responses are ephemeral, so they are visible only to the command user."
  ],

  example: {
    input: "/setbulletinchannel channel:#bulletin",
    response:
      "✅ Bulletin channel set to #bulletin."
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  BULLETIN",
    title: "📌 Bulletin Channel Updated",
    description:
      "The channel used to save bulletin messages has been configured.",
    fields: [
      {
        name: "📢 Selected Channel",
        value: "#bulletin",
        inline: true
      },
      {
        name: "🔐 Access",
        value: "Premium",
        inline: true
      }
    ],
    footer: "Quill & Ink • Bulletin",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      },
      {
        condition: "Selected channel is invalid or not an accepted text channel",
        response:
          "❌ Please select a valid text channel."
      },
      {
        condition: "Database service unavailable",
        response:
          "❌ Database service is unavailable."
      }
    ]
  }
},
{
  name: "setbulletinemoji",
  description: "Set the emoji and reaction count required to nominate messages.",
  usage: "/setbulletinemoji",
  category: "Community",

  details: [
    "Requires the Manage Server permission by default.",
    "Marked as a premium command.",
    "Can only be used inside a Discord server.",
    "Must be used in a normal Discord server text channel.",
    "Requires the database service and BulletinService.",
    "A bulletin channel must already be configured using /setbulletinchannel.",
    "Prompts the invoking user to send a nomination emoji in the current channel within 30 seconds.",
    "The emoji is collected from the user's next message; the command checks that the message content is not empty.",
    "After receiving the emoji, prompts the user to provide the required reaction count.",
    "The reaction count must be a whole number between 1 and 100, inclusive.",
    "Saves the emoji and reaction threshold through BulletinService.",
    "After successfully saving, attempts to delete the two messages used to configure the emoji and threshold.",
    "Message deletion failures are ignored.",
    "Updates the original command response with the saved configuration.",
    "The initial prompt and subsequent updates are ephemeral only for the initial interaction response; the emoji and threshold must be sent as ordinary channel messages.",
    "The command does not explicitly validate that the submitted text is a single valid Unicode or custom Discord emoji.",
    "The command does not explicitly check whether the invoking user has Manage Server permission inside its execute method; the slash command declares that permission as its default."
  ],

  example: {
    input: "/setbulletinemoji",
    response:
      "🎯 Send the emoji you want to use for bulletin nominations in this channel within 30 seconds.\n\n" +
      "Example emoji: ⭐\n" +
      "Required reactions: 5\n\n" +
      "✅ Bulletin configuration saved!\n\n" +
      "🎯 Nomination emoji: ⭐\n" +
      "🔢 Required reactions: 5"
  },

  discordDemo: {
    color: 0xC9A227,
    author: "QUILL & INK  •  BULLETIN",
    title: "🎯 Bulletin Nomination Settings",
    description:
      "Configure the reaction required to nominate messages for the bulletin.",
    fields: [
      {
        name: "🎯 Nomination Emoji",
        value: "⭐",
        inline: true
      },
      {
        name: "🔢 Required Reactions",
        value: "5",
        inline: true
      },
      {
        name: "🔐 Access",
        value: "Premium",
        inline: true
      }
    ],
    footer: "Quill & Ink • Bulletin",

    errors: [
      {
        condition: "Used outside a server",
        response:
          "❌ This command can only be used in a server."
      },
      {
        condition: "Used outside a text-based channel",
        response:
          "❌ This command must be used in a text channel."
      },
      {
        condition: "Channel is not a normal text channel",
        response:
          "❌ Please use this command in a normal text channel."
      },
      {
        condition: "Database service unavailable",
        response:
          "❌ Database service is unavailable."
      },
      {
        condition: "Bulletin channel has not been configured",
        response:
          "❌ Set the bulletin channel first using `/setbulletinchannel`."
      },
      {
        condition: "Emoji was not provided within 30 seconds",
        response:
          "❌ You didn't send an emoji in time."
      },
      {
        condition: "Emoji message is empty",
        response:
          "❌ Please send an emoji."
      },
      {
        condition: "Reaction count was not provided within 30 seconds",
        response:
          "❌ You didn't provide a reaction count in time."
      },
      {
        condition: "Reaction count is not a whole number between 1 and 100",
        response:
          "❌ Please provide a whole number between **1 and 100**."
      },
      {
        condition: "Saving the emoji or threshold fails",
        response:
          "❌ I couldn't save the Bulletin configuration."
      }
    ]
  }
},
{
    name: "confessionchanneladd",
    description:
        "Configure the server's public channel for approved anonymous confessions.",
    usage: "/confessionchanneladd channel:<channel>",
    category: "Community",
    details: [
        "Requires the Manage Server permission by default.",
        "Select a server text channel where approved confessions will be published.",
        "The command configures the confession channel and creates a private moderation thread through ConfessionService.",
        "The command replies privately after configuration succeeds or fails.",
        "Requires the database service and an available ConfessionService implementation."
    ],
    example: {
        input: "/confessionchanneladd channel:#confessions",
        response:
            "Confessions are now configured in #confessions. A private moderation thread has also been created."
    },
    discordDemo: {
        color: 0x5865f2,
        author: "Confession Configuration",
        title: "Confession channel configured",
        description:
            "Confessions are now configured in #confessions. A private moderation thread has also been created.",
        fields: [
            {
                name: "Public channel",
                value: "#confessions",
                inline: true
            },
            {
                name: "Moderation",
                value: "Private moderation thread created",
                inline: true
            }
        ],
        footer: "Confession settings"
    }
},
{
    name: "confessions",
    description:
        "Submit an anonymous confession through a private modal.",
    usage: "/confessions submit",
    category: "Community",
    details: [
        "The submit subcommand is used inside a server.",
        "Requires the server's confession configuration to exist before a submission can begin.",
        "Opens an Anonymous Confession modal with a required paragraph field named content.",
        "The confession text must contain between 1 and 4000 characters.",
        "The command itself only opens the modal. Submission processing, moderation, and publication are handled elsewhere and are not confirmed by this command file.",
        "The command's server and configuration error replies are ephemeral."
    ],
    example: {
        input: "/confessions submit",
        response:
            "A private Anonymous Confession form opens with a required text field where you can write your confession."
    },
    discordDemo: {
        color: 0x5865f2,
        author: "Anonymous Confession",
        title: "Anonymous Confession",
        description:
            "Write your confession in the form below. The field is required and supports up to 4000 characters.",
        fields: [
            {
                name: "Your confession",
                value: "Write your confession...",
                inline: false
            }
        ],
        footer: "Submission and moderation are handled after the form is submitted.",
        errors: [
            {
                condition: "Used outside a server",
                response:
                    "This command can only be used in a server."
            },
            {
                condition: "Confessions are not configured",
                response:
                    "Confessions have not been configured in this server yet."
            }
        ]
    }
},
{
    name: "giveaway",
    description:
        "Create giveaways, configure server-wide entry bonuses, cancel active giveaways, and reroll winners.",
    usage:
        "/giveaway start name:<name> text:<text> prize:<prize> duration:<duration> winners:<1-10>",
    category: "Community",
    details: [
        "Start a giveaway with a name (up to 100 characters), display text (up to 2000 characters), prize (up to 1000 characters), duration (up to 10 characters), and 1–10 winners.",
        "Supported duration formats are seconds (s), minutes (m), hours (h), days (d), and weeks (w), such as 30s, 10m, 2h, 3d, and 1w.",
        "Giveaway duration must be at least 10 seconds and no more than 30 days.",
        "The start subcommand must be used in a sendable server text channel.",
        "The config group supports level bonuses, role bonuses, removing either type of bonus, and viewing the current configuration.",
        "Level bonuses accept levels from 1 to 1,000,000 and bonus entries from 0 to 1,000,000. Role bonuses also accept 0 to 1,000,000 bonus entries.",
        "Configuration, cancellation, and reroll operations require the Manage Server permission at runtime. Starting a giveaway does not have that same explicit permission check in this handler.",
        "Configuration bonuses apply to future giveaways. Existing giveaways retain their original configuration snapshot.",
        "Cancel an active giveaway with /giveaway cancel giveaway:<giveaway ID>.",
        "Reroll a finalist with /giveaway reroll giveaway:<giveaway ID> winner:<1-10>. The command describes rerolls as selecting from the giveaway's top 10 finalists.",
        "Requires the database service. Service errors are surfaced in the command's response; their exact possible messages depend on GiveawayService."
    ],
    example: {
        input:
            "/giveaway start name:Writing Challenge text:Share your best short story! prize:500 Nickel duration:2h winners:3",
        response:
            "🎉 Giveaway started successfully!\n\nWriting Challenge\nGiveaway ID: <generated giveaway ID>"
    },
    discordDemo: {
        color: 0x5865f2,
        author: "Giveaway",
        title: "🎉 Writing Challenge",
        description:
            "Share your best short story!\n\n**Prize:** 500 Nickel\n**Winners:** 3\n**Duration:** 2 hours",
        fields: [
            {
                name: "Giveaway ID",
                value: "`<generated giveaway ID>`",
                inline: false
            }
        ],
        footer: "Giveaway started successfully",
        errors: [
            {
                condition: "Used outside a server",
                response:
                    "Giveaways can only be used inside a server."
            },
            {
                condition: "Database service unavailable",
                response:
                    "The giveaway database service is unavailable."
            },
            {
                condition: "Duration is malformed",
                response:
                    "Invalid duration. Use formats such as `30s`, `10m`, `2h`, `3d`, or `1w`."
            },
            {
                condition: "Duration is below the minimum",
                response:
                    "Giveaway duration must be at least 10 seconds."
            },
            {
                condition: "Duration exceeds the maximum",
                response:
                    "Giveaway duration cannot exceed 30 days."
            },
            {
                condition: "A management operation is used without Manage Server",
                response:
                    "You need the **Manage Server** permission to use this giveaway management command."
            }
        ]
    }
},
{
    name: "leaderboard",
    description:
        "View the server's leveling leaderboard, ranked by total XP and then level.",
    usage: "/leaderboard",
    category: "Leveling",
    details: [
        "Displays up to 10 ranked profiles per page.",
        "Profiles are ordered by total XP descending, with level descending as the secondary sort.",
        "The first three positions use gold, silver, and bronze medal symbols; other positions show their numerical rank.",
        "Each entry displays the member's display name, level, and formatted total XP.",
        "The embed includes the server icon when available, the server name, current page, total pages, and total ranked profiles.",
        "Previous and Next buttons navigate between pages. Only the user who opened the leaderboard can operate its buttons.",
        "The button collector lasts 120 seconds. When it ends, the command attempts to disable both navigation buttons.",
        "If the server has no leveling profiles, the command displays an empty-state embed.",
        "Requires the database service and reads userProfile records for the current server.",
        "The leaderboard response is public, not ephemeral."
    ],
    example: {
        input: "/leaderboard",
        response:
            "🏆 Server Leveling Leaderboard\n\n🥇 PlayerOne\n> Level 24 • 18,450 XP\n\n🥈 PlayerTwo\n> Level 21 • 16,200 XP\n\n🥉 PlayerThree\n> Level 19 • 14,900 XP\n\nPage 1 of 3 • 25 ranked players"
    },
    discordDemo: {
        color: 0x5865f2,
        author: "Server Leveling",
        title: "🏆 Server Leveling Leaderboard",
        description:
            "🥇 **PlayerOne**\n> Level **24** • **18,450 XP**\n\n🥈 **PlayerTwo**\n> Level **21** • **16,200 XP**\n\n🥉 **PlayerThree**\n> Level **19** • **14,900 XP**",
        fields: [
            {
                name: "Navigation",
                value: "◀️ Previous  |  ▶️ Next",
                inline: false
            }
        ],
        footer: "Page 1 of 3 • 25 ranked players",
        errors: [
            {
                condition: "Used outside a server",
                response:
                    "❌ This command can only be used in a server."
            },
            {
                condition: "Database service unavailable",
                response:
                    "❌ Database service is unavailable."
            },
            {
                condition: "No leveling profiles exist",
                response:
                    "No leveling data exists in this server yet."
            },
            {
                condition: "Another user tries to use the navigation buttons",
                response:
                    "❌ Only the person who opened this leaderboard can control it."
            },
            {
                condition: "Leaderboard loading fails",
                response:
                    "❌ Failed to load the leveling leaderboard. Please try again later."
            }
        ]
    }
},
{
    name: "leveling",
    description:
        "Configure level-up announcements, their channels, message templates, embed appearance, and previews.",
    usage: "/leveling <subcommand>",
    category: "Leveling",
    details: [
        "**enable / disable:** Turn level-up announcements on or off.",
        "**channel action:<add|remove> channel:<channel>:** Add or remove a text or announcement channel used for level-up announcements.",
        "**channels:** List configured announcement channels.",
        "**message message:<text>:** Set the announcement description template, up to 4000 characters.",
        "**title title:<text>:** Set the embed title template, up to 256 characters.",
        "**image url:<URL>:** Set the announcement banner image URL, up to 2000 characters.",
        "**color color:<hex>:** Set the embed color using a six-digit hexadecimal value, such as #48D7FF.",
        "**footer footer:<text>:** Set the embed footer template, up to 2048 characters.",
        "**thumbnail enabled:<true|false>:** Toggle the user's avatar as the embed thumbnail.",
        "**timestamp enabled:<true|false>:** Toggle the embed timestamp.",
        "**preview:** Generate a preview using the current settings, the invoking member's details, and their next level.",
        "Supported placeholders are {user}, {userid}, {username}, {displayname}, {avatar}, {server}, {servericon}, {membercount}, and {level}.",
        "The default title is 🎉 Level Up!; the default message is {user} leveled up to **Level {level}**!; the default color is #48D7FF.",
        "The command declares Manage Server as its default required permission.",
        "The command reads and writes guild configuration and leveling channel records through the database service."
    ],
    example: {
        input:
            "/leveling message message:{user} reached Level {level}!",
        response:
            "✅ The level-up announcement message has been updated."
    },
    discordDemo: {
        color: 0x48d7ff,
        author: "Leveling Configuration",
        title: "🎉 Level Up!",
        description:
            "<@123456789012345678> leveled up to **Level 12**!",
        fields: [
            {
                name: "Template",
                value: "`{user} leveled up to **Level {level}**!`",
                inline: false
            },
            {
                name: "Available placeholders",
                value:
                    "`{user}`, `{userid}`, `{username}`, `{displayname}`, `{avatar}`, `{server}`, `{servericon}`, `{membercount}`, `{level}`",
                inline: false
            }
        ],
        footer: "Example preview • actual appearance depends on your configuration",
        errors: [
            {
                condition: "Used outside a server",
                response:
                    "❌ This command can only be used in a server."
            },
            {
                condition: "Database service unavailable",
                response:
                    "❌ Database service is unavailable."
            },
            {
                condition: "An unsupported channel type is selected",
                response:
                    "❌ Please select a text or announcement channel."
            },
            {
                condition: "An invalid color is supplied",
                response:
                    "❌ Invalid color. Please use a six-digit hex color such as `#48D7FF`."
            },
            {
                condition: "A database configuration update fails",
                response:
                    "❌ Failed to update the leveling configuration. Please try again later."
            },
            {
                condition: "Preview generation fails",
                response:
                    "❌ Failed to generate the level-up announcement preview. Please try again later."
            }
        ]
    }
},
{
    name: "autorole",
    description: "Configure the automatic role system for new server members.",
    usage: "/autorole set role:<role> | /autorole disable | /autorole view",
    category: "Moderation",
    details: [
        "/autorole set role:<role> saves the role that new members should automatically receive.",
        "The @everyone role and managed or integration roles cannot be selected.",
        "The selected role must be below the bot's highest role in the server's role hierarchy.",
        "/autorole disable clears the configured automatic role so new members will no longer receive it.",
        "/autorole view displays whether Auto Role is disabled, enabled, or needs attention.",
        "The view command checks whether the configured role still exists and whether the bot can assign it.",
        "The command requires the Manage Server permission and can only be used inside a server.",
        "Configuration is stored in the server's guild configuration."
    ],
    example: {
        input: "/autorole set role:@Member",
        response: "New members will now automatically receive @Member. The configuration has been saved successfully."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Server Management",
        title: "✦ Auto Role Configured",
        description: "New members will now automatically receive @Member.\n\nThe configuration has been saved successfully.",
        fields: [
            {
                name: "Auto Role",
                value: "@Member",
                inline: true
            },
            {
                name: "Status",
                value: "🟢 Enabled",
                inline: true
            }
        ],
        footer: "Configured by Moderator"
    }
},
{
    name: "ban",
    description: "Ban a member from the server and create a moderation case.",
    usage: "/ban user:<user> [reason:<reason>]",
    category: "Moderation",
    details: [
        "The user option is required. The reason is optional.",
        "If no reason is provided, the command uses 'No reason provided'. A blank reason also falls back to this default.",
        "You cannot ban yourself.",
        "The target must currently be a member of the server.",
        "The bot must be able to ban the target. Role hierarchy or other Discord restrictions may prevent the action.",
        "The command requires the Ban Members permission.",
        "After a successful ban, the command creates a moderation case containing the server, target user, moderator, action, and reason.",
        "The successful response displays the user's details, moderator, moderation case number, and reason.",
        "If Discord rejects the ban, the command reports the failure and does not create a moderation case.",
        "If the ban succeeds but moderation case creation fails, the command reports that the member was banned successfully and that the case could not be created.",
        "The command can only be used inside a server."
    ],
    example: {
        input: "/ban user:@Member reason:Repeated harassment",
        response: "@Member has been banned from the server. The confirmation includes the user, moderator, moderation case number, and reason."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🔨 Member Banned",
        description: "@Member has been banned from the server.",
        fields: [
            {
                name: "User",
                value: "Member#0000 (`123456789012345678`)",
                inline: true
            },
            {
                name: "Moderator",
                value: "Moderator#0000",
                inline: true
            },
            {
                name: "Case",
                value: "`B-12`",
                inline: true
            },
            {
                name: "Reason",
                value: "Repeated harassment"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "The moderator tries to ban themselves.",
                response: "⚠️ Invalid Target — You cannot ban yourself."
            },
            {
                condition: "The selected user is not currently a server member.",
                response: "⚠️ Member Not Found — The selected user is not currently a member of this server."
            },
            {
                condition: "The bot cannot ban the target because of role hierarchy or another Discord restriction.",
                response: "⚠️ Cannot Ban Member — The bot cannot ban the selected user."
            },
            {
                condition: "Discord rejects the ban action.",
                response: "❌ Ban Failed — The bot couldn't ban the selected user. Discord rejected the moderation action."
            },
            {
                condition: "The ban succeeds but moderation case creation fails.",
                response: "🔨 Member Banned — The member was banned successfully, but the moderation case could not be created."
            }
        ]
    }
},
{
    name: "case",
    description: "View a moderation case recorded in the current server.",
    usage: "/case number:<number>",
    category: "Moderation",
    details: [
        "The number option is required and must be at least 1.",
        "Looks up a moderation case using both the current server ID and the case number.",
        "Displays the case number, moderation action, affected user, moderator, reason, and creation date.",
        "The date field includes both the full timestamp and a relative time display.",
        "The response is visible only to the person who ran the command.",
        "Requires the Moderate Members permission and can only be used inside a server.",
        "A case created in another server cannot be retrieved through this command."
    ],
    example: {
        input: "/case number:12",
        response: "Displays Moderation Case #12 with its action, user, moderator, reason, and date."
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink • Moderation",
        title: "📋 Moderation Case",
        description: "**Case #12**",
        fields: [
            {
                name: "Action",
                value: "`BAN`",
                inline: true
            },
            {
                name: "User",
                value: "@Member",
                inline: true
            },
            {
                name: "Moderator",
                value: "@Moderator",
                inline: true
            },
            {
                name: "Reason",
                value: "Repeated harassment"
            },
            {
                name: "Date",
                value: "October 17, 2026, 12:00 PM\nA moment ago"
            }
        ],
        footer: "Quill & Ink • Example Server",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "The case number does not exist in the current server.",
                response: "❌ Case Not Found — No moderation case with the requested number exists in this server."
            },
            {
                condition: "The database lookup fails.",
                response: "❌ Case Lookup Failed — I couldn't retrieve that moderation case. Please try again later."
            }
        ]
    }
},
{
    name: "clearwarn",
    description: "Remove a specific warning from a member in the current server.",
    usage: "/clearwarn warning:<warning ID>",
    category: "Moderation",
    details: [
        "The warning option is required and accepts the warning ID as text.",
        "Leading and trailing whitespace are removed from the supplied warning ID.",
        "Looks up the warning using both its ID and the current server ID.",
        "If the warning exists, deletes it from the database.",
        "The success response identifies the affected member, warning ID, and original reason.",
        "Requires the Moderate Members permission and can only be used inside a server.",
        "This command removes the warning record; the source does not show any additional action against the member."
    ],
    example: {
        input: "/clearwarn warning:warn_abc123",
        response: "Warning warn_abc123 has been removed successfully. The confirmation includes the member and original reason."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "✅ Warning Removed",
        description: "Warning `warn_abc123` has been removed successfully.",
        fields: [
            {
                name: "Member",
                value: "@Member",
                inline: true
            },
            {
                name: "Warning ID",
                value: "`warn_abc123`",
                inline: true
            },
            {
                name: "Original Reason",
                value: "Repeated rule violations"
            }
        ],
        footer: "Removed by Moderator",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "No warning with that ID exists in the current server.",
                response: "⚠️ Warning Not Found — No warning with the supplied ID exists in this server."
            },
            {
                condition: "The warning lookup fails.",
                response: "❌ Warning Lookup Failed — I couldn't retrieve that warning. Please try again later."
            },
            {
                condition: "Deleting the warning fails.",
                response: "❌ Removal Failed — I couldn't remove the warning. Please try again later."
            }
        ]
    }
},
{
    name: "kick",
    description: "Kick a member from the server and record a moderation case.",
    usage: "/kick user:<user> [reason:<reason>]",
    category: "Moderation",
    details: [
        "The user option is required. The reason is optional.",
        "If the reason is omitted or contains only whitespace, the command uses 'No reason provided'.",
        "You cannot kick yourself or the bot itself.",
        "The selected user must currently be a member of the server.",
        "The bot must be able to kick the target. Role hierarchy or other Discord restrictions may prevent the action.",
        "Requires the Kick Members permission and can only be used inside a server.",
        "The database service must be available before the kick is attempted.",
        "After a successful kick, the command creates a moderation case with action KICK, the target user, moderator, server, and reason.",
        "The success response includes the user, moderator, case number, and reason.",
        "If Discord rejects the kick, no moderation case is created.",
        "If the kick succeeds but case creation fails, the command reports the successful kick and warns that the case could not be recorded."
    ],
    example: {
        input: "/kick user:@Member reason:Repeated harassment",
        response: "@Member has been kicked from the server. The confirmation includes the user, moderator, moderation case number, and reason."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "👢 Member Kicked",
        description: "@Member has been kicked from the server.",
        fields: [
            {
                name: "User",
                value: "Member#0000 (`123456789012345678`)",
                inline: true
            },
            {
                name: "Moderator",
                value: "Moderator#0000",
                inline: true
            },
            {
                name: "Case",
                value: "`K-12`",
                inline: true
            },
            {
                name: "Reason",
                value: "Repeated harassment"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The moderator attempts to kick themselves.",
                response: "⚠️ Invalid Target — You cannot kick yourself."
            },
            {
                condition: "The moderator attempts to kick the bot itself.",
                response: "⚠️ Invalid Target — I can't kick myself."
            },
            {
                condition: "The target is not currently a member of the server.",
                response: "⚠️ Member Not Found — The selected user is not currently a member of this server."
            },
            {
                condition: "The bot cannot kick the target because of role hierarchy or another Discord restriction.",
                response: "⚠️ Cannot Kick Member — I can't kick the selected user."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "Discord rejects the kick action.",
                response: "❌ Kick Failed — I couldn't kick the selected user. Discord rejected the moderation action."
            },
            {
                condition: "The kick succeeds but moderation case creation fails.",
                response: "👢 Member Kicked — The member was kicked successfully, but the moderation case could not be created."
            }
        ]
    }
},
{
    name: "purge",
    description: "Bulk-delete messages from the current text channel and record a moderation case.",
    usage: "/purge amount:<1-100>",
    category: "Moderation",
    details: [
        "The amount option is required and must be between 1 and 100.",
        "The command must be used inside a server and in a text-based channel that supports bulk deletion.",
        "Uses Discord bulk deletion with the filter that skips messages older than 14 days.",
        "The success response reports the actual number of messages deleted, which may be lower than the requested amount.",
        "Requires the Manage Messages permission.",
        "The database service must be available before the purge is performed.",
        "After deletion, the command creates a moderation case with action PURGE, the executing moderator as both the case user and moderator, and a reason describing the number of deleted messages and channel.",
        "The success response includes the channel, actual deletion count, case number, and moderator.",
        "The success response is visible only to the person who ran the command.",
        "If deletion fails, the command reports the failure and does not create a moderation case.",
        "If deletion succeeds but case creation fails, the command still reports the deletion and warns that the case could not be recorded."
    ],
    example: {
        input: "/purge amount:25",
        response: "Successfully deleted the eligible messages from the current channel. The confirmation shows the actual count and moderation case number."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🧹 Messages Purged",
        description: "Successfully deleted **23** message(s) from #general.",
        fields: [
            {
                name: "Channel",
                value: "#general",
                inline: true
            },
            {
                name: "Deleted",
                value: "23",
                inline: true
            },
            {
                name: "Case",
                value: "`P-13`",
                inline: true
            },
            {
                name: "Moderator",
                value: "Moderator#0000"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The command is used in a non-text-based channel.",
                response: "⚠️ Unsupported Channel — This command can only be used in a text-based channel."
            },
            {
                condition: "The channel does not support bulk deletion.",
                response: "⚠️ Cannot Delete Messages — I can't bulk delete messages in this channel."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. The purge was not performed."
            },
            {
                condition: "Discord rejects the bulk deletion request.",
                response: "❌ Purge Failed — I couldn't delete the messages. Please check my permissions and try again."
            },
            {
                condition: "Messages are deleted but moderation case creation fails.",
                response: "🧹 Messages Purged — The messages were deleted successfully, but the moderation case could not be recorded."
            }
        ]
    }
},
{
    name: "lock",
    description: "Lock the current text channel by denying @everyone permission to send messages.",
    usage: "/lock [reason:<reason>]",
    category: "Moderation",
    details: [
        "The reason is optional. If omitted or blank, the command uses 'Channel locked by moderator.'.",
        "Can only be used inside a server and in a standard Discord TextChannel.",
        "Requires the Manage Channels permission.",
        "The bot edits the @everyone permission overwrite to set SendMessages to false.",
        "The database service must be available before the channel is locked.",
        "After locking the channel, the command creates a moderation case with action LOCK. The case reason includes the channel ID and the supplied reason.",
        "The success response shows the channel, moderator, moderation case number, and reason.",
        "If the channel permission update fails, the command reports a lock failure.",
        "If the channel is locked but case creation fails, the command still reports that the channel was locked successfully."
    ],
    example: {
        input: "/lock reason:Scheduled maintenance",
        response: "The current channel has been locked. The confirmation includes the channel, moderator, case number, and reason."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🔒 Channel Locked",
        description: "#general has been locked.",
        fields: [
            {
                name: "Channel",
                value: "#general",
                inline: true
            },
            {
                name: "Moderator",
                value: "Moderator#0000",
                inline: true
            },
            {
                name: "Case",
                value: "`L-14`",
                inline: true
            },
            {
                name: "Reason",
                value: "Scheduled maintenance"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The current channel is not a standard TextChannel.",
                response: "⚠️ Unsupported Channel — This channel cannot be locked."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "The bot cannot change the channel permissions.",
                response: "❌ Channel Lock Failed — I couldn't lock this channel. Please check my channel permissions."
            },
            {
                condition: "The channel was locked but moderation case creation failed.",
                response: "🔒 Channel Locked — The channel was locked successfully, but the moderation case could not be created."
            }
        ]
    }
},
{
    name: "setmodlog",
    description: "Configure the server's moderation log channel.",
    usage: "/setmodlog channel:<text channel>",
    category: "Moderation",
    details: [
        "The channel option is required and accepts a standard server text channel.",
        "The command verifies that the selected channel is a GuildText channel and a Discord TextChannel.",
        "Saves the selected channel ID to the server's guild configuration as moderationLogId.",
        "Requires the Manage Server permission and can only be used inside a server.",
        "The confirmation is visible only to the person who ran the command.",
        "If saving the configuration fails, the command reports a configuration error.",
        "This command configures moderationLogId. Other logging code may use a separate general logging channel, so this setting should not be assumed to control every type of event log."
    ],
    example: {
        input: "/setmodlog channel:#moderation-logs",
        response: "Moderation cases will now be logged in #moderation-logs."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Server Management",
        title: "📋 Moderation Logs Configured",
        description: "Moderation cases will now be logged in #moderation-logs.",
        fields: [
            {
                name: "Log Channel",
                value: "#moderation-logs",
                inline: true
            }
        ],
        footer: "Configured by Moderator",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The selected channel is not a standard server text channel.",
                response: "⚠️ Invalid Channel — Please select a normal text channel for moderation logs."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "Saving the moderation log configuration fails.",
                response: "❌ Configuration Failed — I couldn't save the moderation log configuration. Please try again later."
            }
        ]
    }
},
{
    name: "slowmode",
    description: "Set or disable the message slowmode delay in the current text channel.",
    usage: "/slowmode seconds:<0-21600>",
    category: "Moderation",
    details: [
        "The seconds option is required and must be between 0 and 21600, equivalent to six hours.",
        "Can only be used inside a server and in a standard Discord TextChannel.",
        "Requires the Manage Channels permission.",
        "Setting seconds to 0 disables slowmode.",
        "If the requested delay already matches the current setting, the command reports that slowmode is unchanged.",
        "The command updates the channel's rate limit through Discord.",
        "The success response is posted in the channel and identifies whether slowmode was updated or disabled.",
        "If the update fails, the command reports an error and advises checking the bot's permissions.",
        "When the logging plugin is enabled and its general logging channel is configured, the command attempts to log the previous delay, new delay, and moderator.",
        "Slowmode logs use the general loggingChannelId, not moderationLogId.",
        "Logging failures do not reverse or invalidate a successful slowmode change.",
        "This command does not create a moderation case in the supplied implementation."
    ],
    example: {
        input: "/slowmode seconds:10",
        response: "Slowmode is now 10 second(s) in #general."
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink • Moderation",
        title: "🐌 Slowmode Updated",
        description: "Slowmode is now **10 second(s)** in #general.",
        footer: "Changed by Moderator",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The current channel is not a standard text channel.",
                response: "⚠️ Invalid Channel — This command can only be used in a standard text channel."
            },
            {
                condition: "The requested delay is already configured.",
                response: "ℹ️ Slowmode Unchanged — Slowmode is already set to the requested value."
            },
            {
                condition: "Discord rejects the slowmode update.",
                response: "❌ Slowmode Update Failed — I couldn't change slowmode. Please check my permissions and try again."
            }
        ]
    }
},
{
    name: "unlock",
    description: "Unlock the current channel by removing the @everyone SendMessages denial.",
    usage: "/unlock [reason:<reason>]",
    category: "Moderation",
    details: [
        "The reason is optional. If omitted or blank, the command uses 'Channel unlocked by moderator.'.",
        "The reason is truncated when necessary to keep the Discord audit-log reason within 512 characters.",
        "Can only be used inside a server and in a channel that supports permission overwrites.",
        "Requires the Manage Channels permission.",
        "The database service must be available before the channel is unlocked.",
        "The command edits the @everyone permission overwrite to set SendMessages to null, removing this explicit override rather than explicitly setting it to true.",
        "After unlocking the channel, the command creates a moderation case with action UNLOCK. The case reason includes the channel ID and reason.",
        "The success response includes the channel, moderator, case number, and reason.",
        "If changing the channel permissions fails, the command reports an unlock failure.",
        "If the channel is unlocked but case creation fails, the command reports the successful unlock and warns that the case was not recorded."
    ],
    example: {
        input: "/unlock reason:Maintenance completed",
        response: "The current channel has been successfully unlocked. The confirmation includes the channel, moderator, case number, and reason."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🔓 Channel Unlocked",
        description: "This channel has been successfully unlocked.",
        fields: [
            {
                name: "Channel",
                value: "#general",
                inline: true
            },
            {
                name: "Moderator",
                value: "@Moderator",
                inline: true
            },
            {
                name: "Case",
                value: "`UL-15`",
                inline: true
            },
            {
                name: "Reason",
                value: "Maintenance completed"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "The command is used outside a server.",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The current channel does not support permission overwrites.",
                response: "⚠️ Invalid Channel — This channel cannot be unlocked."
            },
            {
                condition: "The database service is unavailable.",
                response: "❌ Database Unavailable — The database service is currently unavailable, so the channel was not unlocked."
            },
            {
                condition: "The bot cannot change the channel permissions.",
                response: "❌ Unlock Failed — I couldn't unlock this channel. Check my permissions and channel configuration."
            },
            {
                condition: "The channel was unlocked but moderation case creation failed.",
                response: "⚠️ Channel Unlocked — The channel was successfully unlocked, but the moderation case could not be recorded."
            }
        ]
    }
},
{
    name: "lock",
    description: "Locks the current text channel by preventing @everyone from sending messages. Records a moderation case when possible.",
    usage: "/lock [reason]",
    category: "Moderation",
    details: [
        "Requires the Manage Channels permission.",
        "Can only be used in a server's standard text channel.",
        "Sets the @everyone role's Send Messages permission to false.",
        "The optional reason is used for the channel permission change and moderation case.",
        "If no reason is provided, the default is 'Channel locked by moderator.'.",
        "Creates a moderation case with the LOCK action and displays its case number with the L- prefix.",
        "If the channel is locked but case creation fails, the command reports that the lock succeeded and the case was not recorded.",
        "Requires the database service to be available before attempting to lock the channel."
    ],
    example: {
        input: "/lock reason:Temporary lockdown during an incident",
        response: "🔒 Channel Locked\nThis channel has been locked.\nChannel: #general\nModerator: ModeratorName\nCase: L-12\nReason: Temporary lockdown during an incident"
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🔒 Channel Locked",
        description: "#general has been locked.",
        fields: [
            {
                name: "Channel",
                value: "#general",
                inline: true
            },
            {
                name: "Moderator",
                value: "ModeratorName",
                inline: true
            },
            {
                name: "Case",
                value: "L-12",
                inline: true
            },
            {
                name: "Reason",
                value: "Temporary lockdown during an incident"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "Current channel is not a standard text channel",
                response: "⚠️ Unsupported Channel — This channel cannot be locked."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "The channel permission update fails",
                response: "❌ Channel Lock Failed — I couldn't lock this channel. Please check my channel permissions."
            },
            {
                condition: "Channel locking succeeds but moderation case creation fails",
                response: "🔒 Channel Locked — The channel was locked successfully, but the moderation case could not be created."
            }
        ]
    }
},
{
    name: "setmodlog",
    description: "Configures the text channel where moderation cases are sent.",
    usage: "/setmodlog channel:<text-channel>",
    category: "Moderation",
    details: [
        "Requires the Manage Server permission.",
        "Can only be used in a server.",
        "Requires a normal server text channel; other channel types are rejected.",
        "Saves the selected channel ID to the server's moderationLogId configuration field.",
        "Creates the server configuration if one does not already exist.",
        "The confirmation is sent privately to the command user.",
        "This command configures the moderation-case destination, which is separate from the general logging channel used by automatic event logging."
    ],
    example: {
        input: "/setmodlog channel:#moderation-logs",
        response: "📋 Moderation Logs Configured\nModeration cases will now be logged in #moderation-logs.\nLog Channel: #moderation-logs"
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink",
        title: "📋 Moderation Logs Configured",
        description: "Moderation cases will now be logged in #moderation-logs.",
        fields: [
            {
                name: "Log Channel",
                value: "#moderation-logs",
                inline: true
            }
        ],
        footer: "Configured by ModeratorName",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The selected channel is not a normal text channel",
                response: "⚠️ Invalid Channel — Please select a normal text channel for moderation logs."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ Database Unavailable — The database service is currently unavailable. Please try again later."
            },
            {
                condition: "Saving the configuration fails",
                response: "❌ Configuration Failed — I couldn't save the moderation log configuration. Please try again later."
            }
        ]
    }
},
{
    name: "slowmode",
    description: "Sets or disables the per-user slowmode delay in the current text channel.",
    usage: "/slowmode seconds:<0-21600>",
    category: "Moderation",
    details: [
        "Requires the Manage Channels permission.",
        "Can only be used in a server's standard text channel.",
        "The required seconds value must be between 0 and 21600, inclusive.",
        "A value of 0 disables slowmode; positive values set the delay in seconds.",
        "If the requested value is already active, the command responds that slowmode is unchanged without making another update.",
        "The change is applied through Discord's channel rate-limit setting.",
        "After a successful change, the command attempts to send a confirmation and separately log the change.",
        "If the Logging plugin is enabled and the general logging channel is configured and available, a log embed includes the previous value, new value, and moderator.",
        "Slowmode changes use the general loggingChannelId, not moderationLogId.",
        "Logging failures do not undo the slowmode change."
    ],
    example: {
        input: "/slowmode seconds:10",
        response: "🐌 Slowmode Updated\nSlowmode is now 10 second(s) in #general."
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink • Moderation",
        title: "🐌 Slowmode Updated",
        description: "Slowmode is now 10 second(s) in #general.",
        footer: "Changed by ModeratorName",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "Current channel is not a standard text channel",
                response: "⚠️ Invalid Channel — This command can only be used in a standard text channel."
            },
            {
                condition: "The requested value is already active",
                response: "ℹ️ Slowmode Unchanged — Slowmode is already set to 10 second(s)."
            },
            {
                condition: "Discord rejects the slowmode update",
                response: "❌ Slowmode Update Failed — I couldn't change slowmode. Please check my permissions and try again."
            }
        ]
    }
},
{
    name: "unlock",
    description: "Removes the @everyone Send Messages permission override from the current channel and records a moderation case when possible.",
    usage: "/unlock [reason]",
    category: "Moderation",
    details: [
        "Requires the Manage Channels permission.",
        "Can only be used in a server.",
        "Requires a channel that supports permission overwrites.",
        "Resets the @everyone Send Messages override to null; it does not explicitly set it to true.",
        "The optional reason is recorded with the channel ID in the moderation case and used as the Discord audit-log reason.",
        "If no reason is provided, the default is 'Channel unlocked by moderator.'.",
        "The audit-log reason is truncated when it exceeds 512 characters.",
        "Creates a moderation case with the UNLOCK action and displays its case number with the UL- prefix.",
        "Requires the database service to be available before changing the channel.",
        "If unlocking succeeds but case creation fails, the command reports the successful unlock separately from the failed case recording."
    ],
    example: {
        input: "/unlock reason:Incident resolved",
        response: "🔓 Channel Unlocked\nThis channel has been successfully unlocked.\nChannel: #general\nModerator: ModeratorName\nCase: UL-13\nReason: Incident resolved"
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🔓 Channel Unlocked",
        description: "This channel has been successfully unlocked.",
        fields: [
            {
                name: "Channel",
                value: "#general",
                inline: true
            },
            {
                name: "Moderator",
                value: "ModeratorName",
                inline: true
            },
            {
                name: "Case",
                value: "UL-13",
                inline: true
            },
            {
                name: "Reason",
                value: "Incident resolved"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "Current channel does not support permission overwrites",
                response: "⚠️ Invalid Channel — This channel cannot be unlocked."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ Database Unavailable — The database service is currently unavailable, so the channel was not unlocked."
            },
            {
                condition: "The permission update fails",
                response: "❌ Unlock Failed — I couldn't unlock this channel. Check my permissions and channel configuration."
            },
            {
                condition: "Unlock succeeds but moderation case creation fails",
                response: "⚠️ Channel Unlocked — The channel was successfully unlocked, but the moderation case could not be recorded."
            }
        ]
    }
},
{
    name: "timeout",
    description: "Applies a timeout to a server member for a specified duration.",
    usage: "/timeout user:<member> duration:<minutes> [reason]",
    category: "Moderation",
    details: [
        "Requires the Moderate Members permission.",
        "Can only be used in a server.",
        "The target must be a current server member.",
        "Duration is required and must be between 1 and 40320 minutes (up to 28 days).",
        "The optional reason defaults to 'No reason provided'.",
        "The audit-log reason is truncated when it exceeds 512 characters.",
        "You cannot timeout yourself or the bot.",
        "A moderator cannot timeout a member whose highest role is equal to or higher than theirs, unless the moderator is the server owner.",
        "The bot must be able to moderate the target member.",
        "Requires the database service to be available before applying the timeout.",
        "Creates a moderation case with the TIMEOUT action and displays its case number with the T- prefix.",
        "If the timeout succeeds but case creation fails, the command reports that the timeout was applied but the case was not recorded."
    ],
    example: {
        input: "/timeout user:@Member duration:30 reason:Repeated disruption",
        response: "⏱️ Member Timed Out\n@Member has been timed out successfully.\nUser: @Member\nDuration: 30 minute(s)\nModerator: @Moderator\nCase: T-14\nReason: Repeated disruption"
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "⏱️ Member Timed Out",
        description: "@Member has been timed out successfully.",
        fields: [
            {
                name: "User",
                value: "@Member",
                inline: true
            },
            {
                name: "Duration",
                value: "30 minute(s)",
                inline: true
            },
            {
                name: "Moderator",
                value: "@Moderator",
                inline: true
            },
            {
                name: "Case",
                value: "T-14",
                inline: true
            },
            {
                name: "Reason",
                value: "Repeated disruption"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The user is not in the server",
                response: "⚠️ Member Not Found — That user is not in this server."
            },
            {
                condition: "The moderator targets themselves",
                response: "⚠️ Invalid Target — You can't timeout yourself."
            },
            {
                condition: "The bot is selected as the target",
                response: "⚠️ Invalid Target — I can't timeout myself."
            },
            {
                condition: "The moderator's server membership cannot be verified",
                response: "❌ Permission Check Failed — I couldn't verify your server permissions."
            },
            {
                condition: "The target's highest role is equal to or above the moderator's",
                response: "⚠️ Role Hierarchy — You can't timeout that member because their highest role is equal to or higher than yours."
            },
            {
                condition: "The bot cannot moderate the target",
                response: "⚠️ Cannot Timeout Member — I can't timeout that member. They may have a higher role than me."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ Database Unavailable — The database service is currently unavailable, so the timeout was not applied."
            },
            {
                condition: "Discord rejects the timeout",
                response: "❌ Timeout Failed — I couldn't timeout that member. Please check my permissions and role hierarchy."
            },
            {
                condition: "Timeout succeeds but moderation case creation fails",
                response: "⚠️ Timeout Applied — Case Not Recorded — The member was successfully timed out, but the moderation case could not be recorded."
            }
        ]
    }
},
{
    name: "untimeout",
    description: "Removes an active timeout from a server member.",
    usage: "/untimeout user:<member> [reason]",
    category: "Moderation",
    details: [
        "Requires the Moderate Members permission.",
        "Can only be used in a server.",
        "The target must be a current server member with an active timeout.",
        "The optional reason defaults to 'No reason provided.'.",
        "The audit-log reason is truncated when it exceeds 512 characters.",
        "You cannot remove your own timeout with this command or target the bot.",
        "A moderator cannot modify a member whose highest role is equal to or higher than theirs, unless the moderator is the server owner.",
        "The bot must be able to moderate the target member.",
        "If the member has no active timeout, the command responds without changing anything.",
        "Requires the database service to be available before removing the timeout.",
        "Creates a moderation case with the UNTIMEOUT action and displays its case number with the UT- prefix.",
        "If timeout removal succeeds but case creation fails, the command reports the successful removal separately."
    ],
    example: {
        input: "/untimeout user:@Member reason:Appeal accepted",
        response: "🔓 Timeout Removed\nThe timeout has been successfully removed from @Member.\nUser: @Member\nModerator: @Moderator\nCase: UT-15\nReason: Appeal accepted"
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "🔓 Timeout Removed",
        description: "The timeout has been successfully removed from @Member.",
        fields: [
            {
                name: "User",
                value: "@Member",
                inline: true
            },
            {
                name: "Moderator",
                value: "@Moderator",
                inline: true
            },
            {
                name: "Case",
                value: "UT-15",
                inline: true
            },
            {
                name: "Reason",
                value: "Appeal accepted"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The user is not in the server",
                response: "⚠️ Member Not Found — That user is not in this server."
            },
            {
                condition: "The moderator targets themselves",
                response: "⚠️ Invalid Target — You can't remove your own timeout using this command."
            },
            {
                condition: "The bot is selected as the target",
                response: "⚠️ Invalid Target — I can't remove my own timeout."
            },
            {
                condition: "The moderator's server membership cannot be verified",
                response: "❌ Permission Check Failed — I couldn't verify your server permissions."
            },
            {
                condition: "The target's highest role is equal to or above the moderator's",
                response: "⚠️ Role Hierarchy — You can't modify that member because their highest role is equal to or higher than yours."
            },
            {
                condition: "The bot cannot moderate the target",
                response: "⚠️ Cannot Modify Member — I can't modify that member. They may have a higher role than me."
            },
            {
                condition: "The target has no active timeout",
                response: "ℹ️ No Active Timeout — The selected member is not currently timed out."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ Database Unavailable — The database service is currently unavailable, so the timeout was not removed."
            },
            {
                condition: "Discord rejects the timeout removal",
                response: "❌ Timeout Removal Failed — I couldn't remove the timeout. Check my permissions and role hierarchy."
            },
            {
                condition: "Timeout removal succeeds but case creation fails",
                response: "⚠️ Timeout Removed — Case Not Recorded — The member's timeout was successfully removed, but the moderation case could not be recorded."
            }
        ]
    }
},
{
    name: "warn",
    description: "Issues and saves a warning for a server member, then attempts to create a moderation case.",
    usage: "/warn user:<member> reason:<reason>",
    category: "Moderation",
    details: [
        "Requires the Moderate Members permission.",
        "Can only be used in a server.",
        "Both the target user and reason are required.",
        "The target must be a current server member.",
        "You cannot warn yourself or the bot.",
        "A moderator cannot warn a member whose highest role is equal to or higher than theirs, unless the moderator is the server owner.",
        "The reason is trimmed and truncated to 512 characters if necessary.",
        "Requires the database service to be available.",
        "The warning is saved in the database before the moderation case is created.",
        "Creates a moderation case with the WARN action and displays its case number with the W- prefix.",
        "The success response includes the warning ID and reason.",
        "If saving the warning fails, the command reports that no warning was applied.",
        "If the warning is saved but case creation fails, the command reports that the warning exists even though its moderation case was not recorded."
    ],
    example: {
        input: "/warn user:@Member reason:Repeated disruption",
        response: "⚠️ Member Warned\n@Member has been successfully warned.\nUser: @Member\nModerator: @Moderator\nCase: W-16\nWarning ID: warning-id\nReason: Repeated disruption"
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Moderation",
        title: "⚠️ Member Warned",
        description: "@Member has been successfully warned.",
        fields: [
            {
                name: "User",
                value: "@Member",
                inline: true
            },
            {
                name: "Moderator",
                value: "@Moderator",
                inline: true
            },
            {
                name: "Case",
                value: "W-16",
                inline: true
            },
            {
                name: "Warning ID",
                value: "warning-id",
                inline: true
            },
            {
                name: "Reason",
                value: "Repeated disruption"
            }
        ],
        footer: "Quill & Ink • Moderation",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ Server Only — This command can only be used in a server."
            },
            {
                condition: "The user is not in the server",
                response: "⚠️ Member Not Found — That user is not in this server."
            },
            {
                condition: "The moderator targets themselves",
                response: "⚠️ Invalid Target — You can't warn yourself."
            },
            {
                condition: "The bot is selected as the target",
                response: "⚠️ Invalid Target — I can't warn myself."
            },
            {
                condition: "The moderator's server membership cannot be verified",
                response: "❌ Permission Check Failed — I couldn't verify your server permissions."
            },
            {
                condition: "The target's highest role is equal to or above the moderator's",
                response: "⚠️ Role Hierarchy — You can't warn that member because their highest role is equal to or higher than yours."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ Database Unavailable — The database service is currently unavailable, so the warning was not recorded."
            },
            {
                condition: "Saving the warning fails",
                response: "❌ Warning Failed — I couldn't save the warning to the database. No warning was applied."
            },
            {
                condition: "Warning is saved but moderation case creation fails",
                response: "⚠️ Warning Saved — Case Not Recorded — The member was successfully warned, but the moderation case could not be recorded."
            }
        ]
    }
},

{
    name: "premium-ticket",
    description: "Configure the Premium Ticket system, manage ticket categories, and authorize staff roles or individual members.",
    usage: [
        "/premium-ticket setup",
        "/premium-ticket category add name:<name> description:<description>",
        "/premium-ticket category remove name:<name>",
        "/premium-ticket category list",
        "/premium-ticket staff role-add role:<role>",
        "/premium-ticket staff role-remove role:<role>",
        "/premium-ticket staff role-list",
        "/premium-ticket staff member-add member:<member>",
        "/premium-ticket staff member-remove member:<member>",
        "/premium-ticket staff member-list"
    ].join("\n"),
    category: "Tickets",
    details: [
        "Requires the Manage Server permission by default and is marked as a premium-access command.",
        "All command responses are private to the command user.",
        "The setup subcommand creates the Premium Ticket panel in the current channel.",
        "Category add requires a name of up to 100 characters and a description of up to 500 characters.",
        "Category remove accepts the category name to remove.",
        "Category list displays configured categories with their descriptions. Missing descriptions are displayed as 'No description'.",
        "Staff role-add authorizes a server role to access Premium Tickets; role-remove removes that authorization.",
        "Staff role-list displays configured staff roles.",
        "Staff member-add authorizes an individual user; member-remove removes that authorization.",
        "Staff member-list displays configured individual staff members.",
        "The command delegates category, staff, and panel operations to PremiumTicketsService.",
        "If an operation fails, the command catches the error, logs it, and displays its error message. If the error is not an Error instance, it displays 'An unexpected error occurred.'",
        "The supplied command source does not establish the ticket panel's complete user-facing workflow or the service's validation rules."
    ],
    example: {
        input: "/premium-ticket category add name:Billing description:Questions about premium purchases and payments",
        response: "✅ Premium Ticket category Billing added."
    },
    discordDemo: {
        color: 0x57F287,
        author: "Quill & Ink • Premium Tickets",
        title: "Premium Ticket Categories",
        description: "1. Billing — Questions about premium purchases and payments\n2. Technical Support — Help with technical issues",
        footer: "Premium Ticket Management",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ This command can only be used in a server."
            },
            {
                condition: "The current channel is unavailable during setup",
                response: "❌ This command must be used in a channel."
            },
            {
                condition: "No categories have been configured",
                response: "📭 No Premium Ticket categories have been configured yet."
            },
            {
                condition: "No staff roles have been configured",
                response: "📭 No Premium Ticket staff roles have been configured."
            },
            {
                condition: "No individual staff members have been configured",
                response: "📭 No individual Premium Ticket staff members have been configured."
            },
            {
                condition: "A service operation fails",
                response: "❌ The command displays the error message returned by the failed operation, or 'An unexpected error occurred.' for a non-Error value."
            }
        ]
    }
},
{
    name: "setreactionrole",
    description: "Create an interactive dashboard to configure emoji-based server roles and publish the saved reaction role message.",
    usage: "/setreactionrole channel:<text-or-announcement-channel>",
    category: "Roles",
    details: [
        "Requires the Manage Roles permission. The command also explicitly checks the invoking member's Manage Roles permission.",
        "Can only be used inside a server.",
        "Requires the Reaction Roles plugin to be enabled for the server.",
        "Requires the database service and guild plugin service to be available.",
        "The selected destination must be a server text channel or announcement channel.",
        "The bot must have View Channel, Send Messages, Embed Links, and Add Reactions permissions in the destination channel, plus the server-level Manage Roles permission.",
        "Creates a configuration dashboard with Add Role, Remove Role, and Save buttons.",
        "Only the user who created the dashboard can interact with its configuration buttons.",
        "The dashboard configuration expires after 15 minutes if it is not saved or encounters a save error.",
        "Add Role opens a role selector. Role selection must be completed within 60 seconds.",
        "The @everyone role, managed or integration roles, and roles at or above the bot's highest role are rejected.",
        "After selecting a role, the dashboard creator must send a non-empty emoji value in the destination channel within 60 seconds.",
        "Emoji input is limited to 100 characters. The source performs a length check but does not otherwise fully validate that the input is a single valid emoji.",
        "The same emoji cannot be assigned to different roles in the pending configuration. An existing role's emoji can be updated.",
        "Remove Role lets the dashboard creator select and remove a configured role from the pending configuration.",
        "Save requires at least one configured role and revalidates role existence, managed status, and bot role hierarchy before writing.",
        "Saving calls ReactionRoleService.createReactionRole for each configured role and then replaces the dashboard with the final reaction role message.",
        "The final message instructs members to react to receive a role and remove their reaction to remove it.",
        "If saving fails, the command logs the error, replaces the dashboard with a failure notice when possible, and stops the collector.",
        "If configuration expires, the dashboard is replaced with an expiration notice."
    ],
    example: {
        input: "/setreactionrole channel:#get-roles",
        response: "✅ Reaction role dashboard created in #get-roles.\n\nThe dashboard lets you add roles, choose emojis, remove configured roles, and save the final reaction role message."
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink • Reaction Roles",
        title: "🎭 Reaction Roles",
        description: "Configure the roles members can receive through reactions.\n\n📍 Channel: #get-roles\n👤 Configured by: @Moderator",
        fields: [
            {
                name: "Configured Roles • 2",
                value: "📚 → @Reader\n🎨 → @Artist"
            },
            {
                name: "How it works",
                value: "1. Click Add Role.\n2. Select a server role.\n3. Send the emoji for that role.\n4. Repeat for additional roles.\n5. Click Save when finished.\n\nMembers can react to receive the configured role."
            }
        ],
        footer: "Quill & Ink • Reaction Roles",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ This command can only be used inside a server."
            },
            {
                condition: "The invoking member lacks Manage Roles",
                response: "❌ You need the Manage Roles permission to configure reaction roles."
            },
            {
                condition: "Database service is unavailable",
                response: "❌ The database service is currently unavailable."
            },
            {
                condition: "Guild plugin service is unavailable",
                response: "❌ The guild plugin service is currently unavailable."
            },
            {
                condition: "Reaction Roles plugin is disabled",
                response: "❌ The Reaction Roles plugin is disabled for this server."
            },
            {
                condition: "The selected channel cannot be found",
                response: "❌ I couldn't find the selected channel."
            },
            {
                condition: "The bot lacks destination channel permissions",
                response: "❌ I don't have the required permissions in that channel. The command lists the missing permissions."
            },
            {
                condition: "The bot lacks Manage Roles",
                response: "❌ I need the Manage Roles permission to assign reaction roles."
            },
            {
                condition: "The bot cannot create the dashboard message",
                response: "❌ I couldn't create the reaction role dashboard. Please make sure I can View Channel, Send Messages, and Embed Links there."
            },
            {
                condition: "Another user attempts to configure the dashboard",
                response: "❌ Only the administrator who created this dashboard can configure it."
            },
            {
                condition: "The selected role is @everyone",
                response: "❌ The @everyone role cannot be used as a reaction role."
            },
            {
                condition: "The selected role is managed",
                response: "❌ Managed/integration roles cannot be assigned by Quill & Ink."
            },
            {
                condition: "The selected role is at or above the bot's highest role",
                response: "❌ I cannot manage that role. My highest role must be above it."
            },
            {
                condition: "The emoji value exceeds 100 characters",
                response: "❌ That emoji value is too long. Please send a single Unicode or Discord custom emoji."
            },
            {
                condition: "The emoji is already assigned to a different pending role",
                response: "❌ That emoji is already being used for another role."
            },
            {
                condition: "Save is clicked with no configured roles",
                response: "❌ Add at least one role before saving."
            },
            {
                condition: "A configured role is invalid during saving or a save operation fails",
                response: "⚠️ Reaction Roles could not be completely saved. Please check the bot console and verify my role/channel permissions."
            },
            {
                condition: "The configuration collector expires",
                response: "⏰ Reaction role configuration expired. Run /setreactionrole again to create a new dashboard."
            }
        ]
    }
},
{
    name: "ticket",
    description: "Create a private support ticket channel or close an existing Quill & Ink ticket.",
    usage: "/ticket create\n/ticket close",
    category: "Tickets",
    details: [
        "Can only be used inside a server.",
        "Requires the Tickets plugin to be enabled for the server.",
        "The create subcommand checks that the bot has Manage Channels, View Channel, Send Messages, and Read Message History permissions.",
        "A user cannot create another ticket while a text channel in the channel cache already has the topic ticket-owner:<their user ID>.",
        "New ticket channels use the ticket- prefix followed by a sanitized, lowercase username, limited to 20 characters. If sanitization produces an empty value, the channel name uses the last six characters of the user's ID.",
        "The ticket channel topic stores the owner as ticket-owner:<user ID>.",
        "The @everyone role is denied View Channel access. The ticket owner receives View Channel, Send Messages, Read Message History, Attach Files, and Embed Links permissions. The bot receives channel management and messaging permissions.",
        "After creating the channel, the bot posts a support-ticket embed asking the owner to describe their issue and use /ticket close when it is resolved.",
        "If the initial ticket message cannot be sent, the command attempts to delete the newly created channel and reports the initialization failure.",
        "The close subcommand can only be used in a standard server text channel whose topic begins with ticket-owner:.",
        "The ticket owner or a member with Manage Channels permission can close a valid ticket.",
        "The bot must be available as a server member and have Manage Channels permission to close the ticket.",
        "Closing sends a public notice that the ticket will close in three seconds, then attempts to delete the channel.",
        "The supplied implementation does not configure additional staff-role overwrites when creating a ticket channel. Staff access therefore depends on the channel's actual permissions and any other server configuration.",
        "Ticket creation and closure do not create moderation cases in the supplied source."
    ],
    example: {
        input: "/ticket create",
        response: "✅ Your ticket has been created: #ticket-username"
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink • Support",
        title: "🎫 Support Ticket",
        description: "Welcome @Member!\n\nPlease describe your issue clearly and a staff member will assist you.\n\nWhen your issue has been resolved, use:\n/ticket close",
        fields: [
            {
                name: "Ticket Owner",
                value: "@Member",
                inline: true
            }
        ],
        footer: "Support Ticket",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ This command can only be used inside a server."
            },
            {
                condition: "Tickets plugin is disabled or the guild plugin service is unavailable",
                response: "❌ The Tickets plugin is disabled for this server."
            },
            {
                condition: "The bot's server member cannot be found during creation",
                response: "❌ I couldn't find my server member."
            },
            {
                condition: "The bot lacks required ticket creation permissions",
                response: "❌ I don't have the permissions required to create tickets. I need Manage Channels, View Channel, Send Messages, and Read Message History."
            },
            {
                condition: "The user already has an open ticket in the channel cache",
                response: "❌ You already have an open ticket: #ticket-username"
            },
            {
                condition: "The ticket channel cannot be created",
                response: "❌ I couldn't create your ticket. Please check that I have Manage Channels permission."
            },
            {
                condition: "The ticket channel is created but its initial message fails",
                response: "❌ The ticket channel was created, but I couldn't initialize it. Please try again."
            },
            {
                condition: "Close is used outside a standard text channel",
                response: "❌ This command can only be used inside a ticket channel."
            },
            {
                condition: "The current channel does not have a valid Quill & Ink ticket topic",
                response: "❌ This channel is not a valid Quill & Ink ticket."
            },
            {
                condition: "The invoking member cannot be verified",
                response: "❌ I couldn't verify your server membership."
            },
            {
                condition: "The user is neither the ticket owner nor staff with Manage Channels",
                response: "❌ Only the ticket owner or staff with Manage Channels can close this ticket."
            },
            {
                condition: "The bot's server member cannot be verified during closure",
                response: "❌ I couldn't verify my server permissions."
            },
            {
                condition: "The bot lacks Manage Channels during closure",
                response: "❌ I need Manage Channels permission to close tickets."
            }
        ]
    }
},

{
    name: "rob",
    description: "Attempt to rob another member by starting a private, timed robbery session with a game challenge.",
    usage: "/rob member:<member>",
    category: "Economy & Games",
    details: [
        "Requires a server; cannot be used in DMs.",
        "The target must be another non-bot member of the current server.",
        "You cannot rob yourself or a bot.",
        "You cannot start another robbery while you already have an active robbery.",
        "The robbery system must be available for the command to proceed.",
        "Creates a robbery session with a 10-minute duration and a private text channel for the robbery.",
        "The robbery channel denies View Channel to @everyone and grants access to the initiating robber and the bot. The provided source does not add an explicit permission overwrite for the target.",
        "The initial challenge depends on the current robbery game. Supported challenges in this command include Lock Combination, Guess the Colour, Binary Decryption, Guess the Character, and Police Escape.",
        "Lock Combination displays available clues and provides an Enter Combination button. The message warns that only one attempt is allowed.",
        "Guess the Colour displays a hexadecimal colour value and provides a Guess Colour button. The full hexadecimal value is revealed after the remaining reveal delay, normally 10 seconds.",
        "Binary Decryption displays a binary sequence and provides a Decrypt Binary button. The message warns that only one attempt is allowed.",
        "Guess the Character displays three clues, an optional category, and a Guess Character button. The message warns that only one attempt is allowed.",
        "Police Escape displays a maze image with directional controls, the maze level, hidden bomb count, and instructions about movement and trivia questions.",
        "When the notification service is available, the command notifies the target about the robbery.",
        "On success, the command privately replies with the target and a link to the robbery room.",
        "If robbery setup fails, the command attempts to delete the created channel and cancel the session."
    ],
    example: {
        input: "/rob member:@Example",
        response: "🚨 Robbery started!\n\n🎯 Target: @Example\n🔐 Robbery room: #robbery-..."
    },
    discordDemo: {
        color: 0xD8AD55,
        author: "Quill & Ink",
        title: "🚨 Robbery started!",
        description: "🎯 Target: @Example\n🔐 Robbery room: #robbery-session",
        footer: "Private command response",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ This command can only be used in a server."
            },
            {
                condition: "The selected member is the command user",
                response: "❌ You cannot rob yourself."
            },
            {
                condition: "The selected member is a bot",
                response: "❌ You cannot rob a bot."
            },
            {
                condition: "The selected user is not a member of this server",
                response: "❌ That member is not in this server."
            },
            {
                condition: "The robbery manager is unavailable",
                response: "❌ The robbery system is currently unavailable."
            },
            {
                condition: "The command user already has an active robbery",
                response: "❌ You already have an active robbery."
            },
            {
                condition: "Robbery setup fails",
                response: "❌ The robbery could not be started. Please try again later."
            }
        ]
    }
},
{
    name: "pressure",
    description: "Create a public, persistent Pressure multiplayer game table in the current channel.",
    usage: "/pressure",
    category: "Games",
    details: [
        "Can only be used inside a server.",
        "Restricted to server administrators, with both a slash-command permission restriction and a runtime permission check.",
        "Requires a channel ID so the public table can be created in the current channel.",
        "Creates an empty table. The command user does not automatically join, no host is created, and no match starts automatically.",
        "Players join using the JOIN TABLE button.",
        "The initial table shows zero occupied seats, a buy-in range of 100–10,000 Nickel, and a prompt to join.",
        "The table advertises a four-player game built around High Pressure or Super Pressure hands, managing Nickel, and passing cards clockwise.",
        "The initial table includes JOIN TABLE, CASH OUT, and HOW TO PLAY buttons. CASH OUT starts disabled.",
        "The table is represented by a persistent public message, and its message ID is stored in the session.",
        "The command refuses to create another table when an active persistent table already exists in the same guild and channel.",
        "PressureService manages authoritative table state, PressureTableRenderer creates the table visual, and an optional lifecycle callback lets PressurePlugin apply dedicated channel permissions after the message is created.",
        "If rendering, message creation, or the lifecycle callback fails, the command attempts to remove the temporary session. If the public message was created but the lifecycle callback fails, it also attempts to delete that message."
    ],
    example: {
        input: "/pressure",
        response: "🎴 PRESSURE\n\nFour players. One table. Every decision increases the pressure.\n\nBuild a High Pressure or Super Pressure hand while managing your Nickel and passing cards clockwise.\n\n🎴 Seats: 0 / 4\n💰 Buy-in: 100–10,000 Nickel\n\nThe table is ready.\nSelect JOIN TABLE to enter the game."
    },
    discordDemo: {
        color: 0xD8AD55,
        author: "Quill & Ink",
        title: "🎴 PRESSURE",
        description: "Four players. One table. Every decision increases the pressure.\n\nBuild a High Pressure or Super Pressure hand while managing your Nickel and passing cards clockwise.\n\n🎴 Seats: 0 / 4\n💰 Buy-in: 100–10,000 Nickel\n\nThe table is ready.\nSelect JOIN TABLE to enter the game.",
        fields: [
            {
                name: "Available Controls",
                value: "🎴 JOIN TABLE\n💰 CASH OUT (initially disabled)\n❔ HOW TO PLAY"
            }
        ],
        footer: "Pressure • Quill & Ink",
        errors: [
            {
                condition: "Used outside a server",
                response: "🎴 Pressure can only be created inside a server."
            },
            {
                condition: "The user is not a server administrator",
                response: "🔒 Pressure tables can only be created by server administrators."
            },
            {
                condition: "The current channel cannot be identified",
                response: "🎴 Pressure could not determine the current game channel."
            },
            {
                condition: "A table already exists in the current channel",
                response: "🎴 Pressure already has a table in this channel.\n\nThe existing table must be removed before creating another one."
            }
        ]
    }
},
{
  name: "pressure remove",
  description:
    "Remove the Pressure table from the current channel and restore the channel's previous permissions.",
  usage: "/pressure remove",
  category: "Games & Administration",
  details: [
    "Removes the Pressure table from the current channel.",
    "Restores the channel permissions that were in place before the table was created.",
  ],
},
{
    name: "tcg",
    description: "Create a persistent Quill & Ink Trading Card Game table in the current text channel.",
    usage: "/tcg",
    category: "Games",
    details: [
        "Can only be used inside a server and in a standard text channel.",
        "Creates a TCG table for the current guild and channel.",
        "A table already exists in the same channel if the service reports TABLE_ALREADY_EXISTS; the command then refuses to create a duplicate.",
        "The initial lobby contains Join, Leave, Start, and How to Play buttons.",
        "Leave and Start are initially disabled. Join and How to Play are enabled.",
        "The table buttons include the table ID in their custom IDs so interactions can identify the corresponding table.",
        "The command stores the Discord message ID against the table after the initial reply succeeds.",
        "An optional lifecycle callback allows the plugin to perform additional table-creation work after the message ID is stored.",
        "If table creation or the lifecycle callback fails, the command attempts to cancel and delete the temporary table state.",
        "If the interaction has already been replied to or deferred when an error occurs, the command attempts to replace the reply with a table-creation failure message."
    ],
    example: {
        input: "/tcg",
        response: "A persistent TCG lobby is created in the current text channel with Join, Leave, Start, and How to Play buttons."
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink",
        title: "TCG Lobby",
        description: "The persistent Quill & Ink TCG table is ready.",
        fields: [
            {
                name: "Available Controls",
                value: "🟢 Join\n⚪ Leave (initially disabled)\n🔵 Start (initially disabled)\n❔ How to Play"
            }
        ],
        footer: "Quill & Ink TCG",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ TCG commands can only be used in a server."
            },
            {
                condition: "Used outside a standard text channel",
                response: "❌ TCG commands can only be used in a text channel."
            },
            {
                condition: "A TCG table already exists in this channel",
                response: "❌ A TCG table already exists in this channel."
            },
            {
                condition: "Table creation or its lifecycle callback fails",
                response: "❌ The TCG table could not be created. Any temporary table state was rolled back."
            }
        ]
    }
},
{
    name: "tcg-remove",
    description: "Request removal of the TCG table in the current text channel and restoration of the channel's normal permissions.",
    usage: "/tcg-remove",
    category: "Games & Administration",
    details: [
        "Can only be used inside a server and in a standard text channel.",
        "Requires Manage Channels permission.",
        "Requests cleanup for the TCG table belonging to the current guild and channel.",
        "If no table exists in the current channel, the command reports that there is no TCG table to remove.",
        "If cleanup is accepted, the command confirms that removal has started, the active match has been stopped, the channel will be cleaned up, and normal permissions will be restored.",
        "The command explicitly states that removal will not create a replacement TCG table.",
        "The actual cleanup is delegated to the supplied removal callback.",
        "If cleanup is already running for the channel, the command reports that condition instead of starting another cleanup.",
        "The command replies ephemerally with its status or error message."
    ],
    example: {
        input: "/tcg-remove",
        response: "🧹 TCG removal started. The active match has been stopped, the channel will be cleaned up, and its normal permissions will be restored. No new TCG table will be created."
    },
    discordDemo: {
        color: 0x5865F2,
        author: "Quill & Ink",
        title: "🧹 TCG removal started",
        description: "The active match has been stopped, the channel will be cleaned up, and its normal permissions will be restored.\n\nNo new TCG table will be created.",
        footer: "Private command response",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ TCG commands can only be used in a server."
            },
            {
                condition: "Used outside a standard text channel",
                response: "❌ TCG commands can only be used in a text channel."
            },
            {
                condition: "The user lacks Manage Channels permission",
                response: "❌ You need Manage Channels permission to remove the TCG table."
            },
            {
                condition: "No TCG table exists in the current channel",
                response: "❌ No TCG table exists in this channel."
            },
            {
                condition: "Cleanup is already running",
                response: "❌ TCG cleanup is already running for this channel."
            },
            {
                condition: "Removal fails",
                response: "❌ The TCG table could not be removed."
            }
        ]
    }
},

{
    name: "store",
    description: "Set up and recover the persistent server Store, manage categories and items, and configure staff authorized to manage Store purchases.",
    usage: "/store setup | /store recover | /store edit action:<action> | /store staff <subcommand>",
    category: "Economy & Store",
    details: [
        "Requires a server and an available database service.",
        "The setup and recover subcommands require Manage Server permission and a server text channel.",
        "Use /store setup to create the persistent Store panel. A server can have only one configured Store panel through this command.",
        "A newly created Store panel welcomes members and explains that they can browse categories and spend Nickel on available items.",
        "After setup, use /store edit to add categories and items.",
        "Use /store recover to recreate a missing Store panel without resetting Store data. An existing Store configuration is required.",
        "Store recovery preserves categories, items, prices, stock, staff configuration, purchases, and inventory.",
        "The edit subcommand requires authorization through configured Store staff or administrator status. The Store must already be configured.",
        "Available edit actions are category-add, category-remove, item-add, item-edit, and item-remove.",
        "Adding a category requires a non-empty name. An optional image URL may be provided.",
        "Removing a category hides it from the Store and also hides its active items. Existing purchase and inventory records remain preserved.",
        "Adding an item requires item-code, name, description, price, type, and category-id. An optional image URL may be supplied.",
        "Item prices must be whole numbers greater than zero and are denominated in Nickel.",
        "Native items require an initial stock amount. External items must not have a stock value because they use external fulfillment.",
        "Stock must be a whole number of zero or greater and cannot exceed 2,147,483,647.",
        "Item codes identify items and must be unique within the server. The service enforces item and category validation.",
        "Use item-edit with an existing item-code and at least one field to change. Supported fields include name, description, price, stock, type, category-id, and image-url.",
        "External items cannot be assigned Store stock. The Store service enforces the final stock rules when item types change.",
        "Removing an item makes it unavailable in the Store while preserving existing purchase and inventory records.",
        "Category and item changes refresh the persistent Store panel.",
        "The staff subcommand group requires Manage Server permission.",
        "Use /store staff role-add to authorize a role to manage Store purchases, and role-remove to revoke that role's authorization.",
        "Use /store staff role-list to display configured Store staff roles.",
        "Use /store staff member-add to authorize an individual user, and member-remove to revoke that user's authorization.",
        "Use /store staff member-list to display configured individual Store staff members.",
        "Use /store edit action:category-remove without category-id to display active categories and their IDs.",
        "Setup and recovery create a new panel message in the current text channel. Recovery updates the existing Store configuration to use the recreated panel."
    ],
    example: {
        input: "/store edit action:item-add item-code:VIP name:VIP Pass description:Unlock VIP perks price:500 type:NATIVE category-id:<category-id> stock:10",
        response: "✅ Item added.\n\nVIP Pass is now available in the Store.\n\nCode: VIP\nPrice: 500 Nickel\nType: NATIVE\nStock: 10"
    },
    discordDemo: {
        color: 0xD8AD55,
        author: "Quill & Ink",
        title: "🛒 Quill Store",
        description: "Welcome to the server Store.\n\nBrowse the available categories and items below and spend your Nickel on the things your server has to offer.",
        fields: [
            {
                name: "🛍️ Browse the Store",
                value: "Explore available categories and items, then spend Nickel on the things your server offers.",
                inline: false
            },
            {
                name: "⚙️ Store Management",
                value: "`/store setup`\n`/store recover`\n`/store edit`",
                inline: true
            },
            {
                name: "🛡️ Staff Management",
                value: "`/store staff role-add`\n`/store staff member-add`\n`/store staff role-list`\n`/store staff member-list`",
                inline: true
            }
        ],
        footer: "Quill & Ink • Store",
        errors: [
            {
                condition: "Used outside a server",
                response: "❌ This command can only be used in a server."
            },
            {
                condition: "The database service is unavailable",
                response: "❌ Database service is unavailable."
            },
            {
                condition: "Setup or recovery is attempted without Manage Server permission",
                response: "❌ You need Manage Server to set up or recover the Store."
            },
            {
                condition: "The current channel is not a server text channel",
                response: "❌ The Store panel must be created in a server text channel."
            },
            {
                condition: "A Store is already configured during setup",
                response: "❌ This server already has a Store panel in the configured channel."
            },
            {
                condition: "Recovery is attempted before Store setup",
                response: "❌ This server does not have a Store configured. Use `/store setup` first."
            },
            {
                condition: "The user is not authorized to manage the Store",
                response: "❌ You are not authorized to manage this Store."
            },
            {
                condition: "The Store is not configured when editing",
                response: "❌ This server does not have a Store yet. Use `/store setup` first."
            },
            {
                condition: "A category is added without a name",
                response: "❌ Category name required.\n\nProvide the category name using the `name` option."
            },
            {
                condition: "An item is added without all required details",
                response: "❌ Item details incomplete.\n\nAdd an item with: `item-code`, `name`, `description`, `price`, `type`, and `category-id`."
            },
            {
                condition: "The item price is not a whole number or is zero or negative",
                response: "❌ The item price must be a whole number of Nickel greater than zero."
            },
            {
                condition: "Stock is not a whole number of zero or greater",
                response: "❌ Stock must be a whole number of 0 or greater."
            },
            {
                condition: "Stock exceeds the maximum supported value",
                response: "❌ Stock cannot exceed 2,147,483,647."
            },
            {
                condition: "A Native item is added without stock",
                response: "❌ Native items require an initial stock amount."
            },
            {
                condition: "Stock is provided for an External item",
                response: "❌ External items do not use Store stock. Remove the `stock` option."
            },
            {
                condition: "An item is edited without an item code",
                response: "❌ Item code required.\n\nUse the item's current `item-code` to identify which item should be edited."
            },
            {
                condition: "An item edit provides no fields to change",
                response: "❌ Provide at least one field to change."
            },
            {
                condition: "A staff management action is attempted without Manage Server permission",
                response: "❌ You need Manage Server to manage Store staff."
            }
        ]
    }
},

{
    name: "dice",
    description: "Wager Nickel on predicting the total of two six-sided dice. Choose an exact total or a range and win a probability-based payout if the result matches.",
    usage: "/dice direction:<exact|between> target:<2-12> wager:<20-500> [target2:<2-12>]",
    category: "Economy & Games",
    details: [
        "Can only be played in a server.",
        "Choose `exact` to predict one total or `between` to predict an inclusive range.",
        "The target must be between 2 and 12.",
        "The wager must be between 20 and 500 Nickel.",
        "For an exact prediction, provide `target` and do not provide `target2`.",
        "For a range prediction, provide `target` as the lower bound and `target2` as the upper bound. The upper bound must be greater than or equal to the lower bound.",
        "The game rolls two six-sided dice and adds their values.",
        "Only one active Dice game is allowed per player in the same server.",
        "The wager is withdrawn before the dice are rolled. The game also records the qualifying wager for the player.",
        "The payout multiplier is based on the number of winning combinations out of 36 possible two-dice combinations. The inverse-probability multiplier is capped at 10×, then halved and rounded down to two decimal places.",
        "A winning prediction receives the calculated total return. A losing prediction receives zero return.",
        "The result embed displays the prediction, dice values and total, wager, multiplier, total return, and net profit.",
        "A winning result shows the calculated multiplier. A losing result displays a dash for the multiplier.",
        "If an error occurs after the wager is collected, the command does not automatically refund the wager because settlement may already have succeeded. The player is instructed to contact a moderator before retrying.",
        "The game resolves immediately through the slash command and does not use gameplay buttons or modal interactions."
    ],
    example: {
        input: "/dice direction:exact target:7 wager:100",
        response: "🎲 Dice\n\nYour prediction was correct.\n\nPrediction: Exact: 7\nDice result: 3 + 4 = 7\nWager: 100 Nickel\nMultiplier: 3.00×\nTotal return: 300 Nickel\nNet profit: 200 Nickel"
    },
    discordDemo: {
        color: 0x35B7A4,
        author: "Quill & Ink • Games",
        title: "🎲 Dice",
        description: "Your prediction was correct.",
        fields: [
            {
                name: "Prediction",
                value: "Exact: **7**",
                inline: true
            },
            {
                name: "Dice result",
                value: "3 + 4 = **7**",
                inline: true
            },
            {
                name: "Wager",
                value: "100 Nickel",
                inline: true
            },
            {
                name: "Multiplier",
                value: "3.00×",
                inline: true
            },
            {
                name: "Total return",
                value: "300 Nickel",
                inline: true
            },
            {
                name: "Net profit",
                value: "200 Nickel",
                inline: true
            }
        ],
        footer: "Quill & Ink • Games",
        errors: [
            {
                condition: "Used outside a server",
                response: "Dice can only be played in a server."
            },
            {
                condition: "The wager is outside the allowed range",
                response: "Your wager must be between 20 and 500 Nickel."
            },
            {
                condition: "target2 is supplied for an exact prediction",
                response: "The `target2` option is only used with `between`."
            },
            {
                condition: "A between prediction is missing target2",
                response: "Choose `target2` as the upper end of your range."
            },
            {
                condition: "target2 is lower than target",
                response: "`target2` must be greater than or equal to `target`."
            },
            {
                condition: "An invalid prediction direction is supplied",
                response: "Choose either `exact` or `between`."
            },
            {
                condition: "The player already has an active Dice game in this server",
                response: "You already have an active Dice game."
            },
            {
                condition: "The game fails before collecting the wager",
                response: "The game couldn't start. Your wager was not collected."
            },
            {
                condition: "The game fails after collecting the wager",
                response: "The game encountered a problem after collecting your wager. Please contact a moderator before retrying."
            }
        ]
    }
},
{
    name: "oddoreven",
    description: "Challenge another human player to a two-person Odd or Even game. Both players wager Nickel, choose opposite sides, and privately lock in a number from 1 to 5.",
    usage: "/oddoreven player:<player> wager:<20-500>",
    category: "Economy & Games",
    aliases: [],
    details: [
        "Can only be played in a server.",
        "Choose another human player. You cannot challenge yourself or a bot.",
        "Each player wagers the same amount, between 20 and 500 Nickel. The total pot is twice the individual wager.",
        "The challenge is posted publicly with buttons for choosing Odd or Even.",
        "The two players must choose opposite sides. Once both sides are selected, each player can privately choose a number from 1 to 5.",
        "Each player can select a side only once and lock in a number only once.",
        "Number choices are private while the opponent is choosing.",
        "The two numbers are added together. An even total wins for the player who chose Even; an odd total wins for the player who chose Odd.",
        "The winning player receives the entire pot through the game's settlement service.",
        "Wagers are not collected until both players have locked in their numbers.",
        "When both numbers are locked in, the game withdraws both wagers and records qualifying wagers for both players before settling the result.",
        "The challenge expires after five minutes. If it expires before settlement, no Nickel is collected.",
        "The game has a maximum of 500 active sessions.",
        "The result message shows both players' selected sides and numbers, the sum and parity, the pot, and whether settlement completed or had already been processed.",
        "If settlement fails, the game removes the controls and displays a warning asking the players to contact a server moderator before retrying."
    ],
    example: {
        input: "/oddoreven player:@Example wager:100",
        response: "🎲 Odd or Even Challenge\n\nYou challenged Example!\n\nWager per player: 100 Nickel\nTotal pot: 200 Nickel\n\nBoth players must choose opposite sides, then privately lock in a number from 1 to 5.\nThe numbers are added together. The matching side wins the entire pot.\n\n⏳ This challenge expires in 5 minutes. No wager is taken before both numbers are locked in."
    },
    discordDemo: {
        color: 0x39C5BB,
        author: "Quill & Ink • Games",
        title: "🎲 Odd or Even Challenge",
        description: "**You** challenged **Example**!\n\n**Wager per player:** 100 Nickel\n**Total pot:** 200 Nickel\n\nBoth players must choose opposite sides, then privately lock in a number from **1 to 5**.\nThe numbers are added together. The matching side wins the entire pot.\n\n⏳ This challenge expires in **5 minutes**. No wager is taken before both numbers are locked in.",
        fields: [
            {
                name: "Choose a side",
                value: "🔵 Odd\n🟢 Even",
                inline: true
            },
            {
                name: "Choose a number",
                value: "1 · 2 · 3 · 4 · 5\n\nYour number remains private until the result.",
                inline: true
            },
            {
                name: "Example result",
                value: "You chose 3 and your opponent chose 4.\nTotal: 3 + 4 = **7 (ODD)**\nThe player who chose Odd wins the 200 Nickel pot.",
                inline: false
            }
        ],
        footer: "Choose your side below. Your number will remain private until the result.",
        errors: [
            {
                condition: "Used outside a server",
                response: "Odd or Even can only be played in a server."
            },
            {
                condition: "The wager is outside the allowed range",
                response: "Your wager must be between 20 and 500 Nickel."
            },
            {
                condition: "The opponent is a bot or the command user",
                response: "Choose another human player."
            },
            {
                condition: "The maximum number of active sessions has been reached",
                response: "Too many games are active right now. Try again shortly."
            },
            {
                condition: "A game control is invalid",
                response: "This game control is invalid."
            },
            {
                condition: "The challenge has expired or already finished",
                response: "This Odd or Even game has expired or already finished."
            },
            {
                condition: "The challenge expires before the player finishes",
                response: "This challenge has expired. No wager was collected."
            },
            {
                condition: "The control is used in a different server",
                response: "This game belongs to a different server."
            },
            {
                condition: "Someone other than the two challenged players uses a control",
                response: "Only the two challenged players can use these controls."
            },
            {
                condition: "The player attempts to choose a side after side selection closes",
                response: "Side selection is already closed."
            },
            {
                condition: "The player tries to choose a side more than once",
                response: "You've already chosen your side."
            },
            {
                condition: "Both players attempt to choose the same side",
                response: "Your opponent chose ODD or EVEN. You must choose the opposite side."
            },
            {
                condition: "An invalid side is selected",
                response: "Invalid side selection."
            },
            {
                condition: "The player attempts to choose a number before choosing a side or after locking in a number",
                response: "You cannot choose a number at this stage, or you've already locked yours in."
            },
            {
                condition: "The selected number is outside 1 to 5",
                response: "Choose a number from 1 to 5."
            },
            {
                condition: "An unknown game action is received",
                response: "Unknown game action."
            },
            {
                condition: "Automatic settlement fails",
                response: "⚠️ The game could not be settled automatically. Please contact a server moderator before retrying."
            }
        ]
    }
},

{
    name: "rps",
    description: "Play Rock, Paper, Scissors for Nickel against another player or the bank.",
    usage: "/rps wager:<50-1000> mode:<pvp|pvb> choice:<rock|paper|scissors> [player:<player>]",
    category: "Economy & Games",
    details: [
        "Can only be played in a server.",
        "Choose a wager between 50 and 1,000 Nickel.",
        "Choose Player vs Player (pvp) or Player vs Bank (pvb), then select Rock, Paper, or Scissors.",
        "For Player vs Player, the player option is required. You cannot challenge yourself or a bot.",
        "A PvP challenge displays the challenger's chosen move and asks the challenged player to select their move using buttons.",
        "Only the challenged player can use the PvP move buttons.",
        "PvP challenges expire after 60 seconds. If a challenge expires before the opponent chooses, no wager is collected.",
        "PvP wagers are collected from both players only after the challenged player chooses a move.",
        "In PvP, the winner receives the pot, which is twice the individual wager. A draw returns both wagers through the settlement service.",
        "For Player vs Bank, the bank randomly chooses Rock, Paper, or Scissors after the player's wager is withdrawn.",
        "Against the bank, a win returns 2× the wager in total, a draw returns the original wager, and a loss returns zero.",
        "Qualifying wagers are recorded for players when the game proceeds to settlement.",
        "The result shows the moves, wager, outcome, and settlement status.",
        "If settlement fails, the game displays a warning and asks the player to contact a server moderator before retrying.",
        "The game supports up to 500 active PvP challenges."
    ],
    example: {
        input: "/rps wager:100 mode:pvb choice:rock",
        response: "🎮 Rock, Paper, Scissors — vs Bank\n\nYour move: 🪨 Rock\nBank's move: ✂️ Scissors\nWager: 100 Nickel\n\n🎉 You won! Your total return is 2× your wager.\n\nSettlement: Completed"
    },
    discordDemo: {
        color: 0x39C5BB,
        author: "Quill & Ink • Games",
        title: "🎮 Rock, Paper, Scissors — vs Bank",
        description: "🎉 You won! Your total return is 2× your wager.",
        fields: [
            {
                name: "Your move",
                value: "🪨 Rock",
                inline: true
            },
            {
                name: "Bank's move",
                value: "✂️ Scissors",
                inline: true
            },
            {
                name: "Wager",
                value: "100 Nickel",
                inline: true
            },
            {
                name: "Result",
                value: "🎉 You won! Your total return is 2× your wager.",
                inline: false
            },
            {
                name: "Settlement",
                value: "Completed",
                inline: true
            }
        ],
        footer: "Choose your move before the bank reveals its own.",
        errors: [
            {
                condition: "Used outside a server",
                response: "RPS can only be played in a server."
            },
            {
                condition: "The move is invalid",
                response: "Choose Rock, Paper, or Scissors."
            },
            {
                condition: "The wager is outside the allowed range",
                response: "Your wager must be between 50 and 1000 Nickel."
            },
            {
                condition: "An invalid game mode is supplied",
                response: "Choose either Player vs Player or Player vs Bank."
            },
            {
                condition: "PvP is selected without specifying a player",
                response: "Please tag a player when choosing Player vs Player."
            },
            {
                condition: "The challenged player is a bot or the command user",
                response: "Choose another human player for your challenge."
            },
            {
                condition: "The active PvP session limit is reached",
                response: "Too many RPS games are active right now. Try again shortly."
            },
            {
                condition: "A move button is invalid or expired",
                response: "That RPS control is invalid or expired. Start a new game."
            },
            {
                condition: "The game has expired or finished",
                response: "This RPS game has expired or already finished."
            },
            {
                condition: "A player other than the challenged player uses a PvP move button",
                response: "These move buttons are reserved for the challenged player."
            },
            {
                condition: "A move button is used in another server",
                response: "This game belongs to a different server."
            },
            {
                condition: "PvP settlement fails",
                response: "⚠️ The match could not be completed automatically. Please contact a server moderator before retrying."
            },
            {
                condition: "Player vs Bank execution or settlement fails",
                response: "⚠️ The game could not be completed automatically. Please contact a server moderator before retrying."
            }
        ]
    }
},

{
    name: "slots",
    description: "Spin the Quill & Ink slot machine by wagering Nickel on a single-player game with symbol combinations and calculated payouts.",
    usage: "/slots wager:<20-500>",
    category: "Economy & Games",
    details: [
        "Can only be played in a server.",
        "The wager must be between 20 and 500 Nickel.",
        "Only one active Slots game is allowed per player in the same server.",
        "The wager is withdrawn before the slot result is generated.",
        "The game records the player's qualifying wager.",
        "Slot outcomes, winning combinations, multipliers, and payouts are calculated by SlotService.",
        "The result shows the wager, winning symbol and count when applicable, multiplier, total return, and net profit.",
        "A winning combination has a positive payout. If there is no winning combination, the result shows No match and a dash for the multiplier.",
        "The game attempts to render the reels as an image attachment. If image rendering or delivery fails, it attempts to display a text-only result instead.",
        "If the result has already been settled but cannot be delivered, the command advises checking the balance before retrying.",
        "If a failure occurs after collecting the wager but before settlement is confirmed, a moderator may need to verify settlement status. The player is advised not to retry until it has been checked.",
        "The game resolves immediately from the slash command and does not use gameplay buttons."
    ],
    example: {
        input: "/slots wager:100",
        response: "🎰 Quill & Ink • Slots\n\nA winning combination!\n\nWager: 100 Nickel\nCombination: [Winning symbol] × 3\nMultiplier: 2.00×\nTotal return: 200 Nickel\nNet profit: 100 Nickel\n\nReels: [symbol] │ [symbol] │ [symbol]"
    },
    discordDemo: {
        color: 0x35B7A4,
        author: "Quill & Ink • Games",
        title: "🎰 Quill & Ink • Slots",
        description: "A winning combination!",
        fields: [
            {
                name: "Wager",
                value: "100 Nickel",
                inline: true
            },
            {
                name: "Combination",
                value: "Winning symbol × 3",
                inline: true
            },
            {
                name: "Multiplier",
                value: "2.00×",
                inline: true
            },
            {
                name: "Total return",
                value: "200 Nickel",
                inline: true
            },
            {
                name: "Net profit",
                value: "100 Nickel",
                inline: true
            },
            {
                name: "Reels",
                value: "🎲 │ 🎲 │ 🎲",
                inline: false
            }
        ],
        footer: "Quill & Ink • Games",
        errors: [
            {
                condition: "Used outside a server",
                response: "Slots can only be played in a server."
            },
            {
                condition: "The wager is outside the allowed range",
                response: "Your wager must be between 20 and 500 Nickel."
            },
            {
                condition: "The player already has an active Slots game in this server",
                response: "You already have an active Slots game."
            },
            {
                condition: "The game fails before collecting the wager",
                response: "Slots couldn't start. Your wager was not collected."
            },
            {
                condition: "The game fails after collecting the wager but before settlement is confirmed",
                response: "Slots encountered a problem after collecting your wager. The settlement status may need to be checked by a moderator. Please do not retry until it has been verified."
            },
            {
                condition: "Settlement succeeds but the result cannot be delivered",
                response: "Your Slots game was settled, but the result could not be delivered. Please check your balance before retrying."
            }
        ]
    }
},
{
  name: "logging",
  description: "Configure and inspect server logging settings.",
  usage: "/logging set channel:<channel> | /logging view | /logging disable",
  category: "Moderation & Administration",
  details: [
    "Requires the Manage Server permission by default.",
    "/logging set saves a standard text channel as the logging destination and enables voice logging.",
    "/logging view displays whether logging is enabled and the current settings for member joins, member leaves, message deletions, message edits, voice events, and moderation.",
    "/logging disable clears the configured logging channel and disables voice logging.",
    "The command requires the database service. Configuration changes are saved through the guild configuration database record.",
    "Command responses are ephemeral, so only the person running the command sees them.",
    "If no configuration exists yet, /logging view reports that logging has not been configured."
  ],
  example: {
    input: "/logging set channel:#server-logs",
    response: "📋 Logging Configured\n\nServer logging has been configured successfully.\n\nLog destination: #server-logs\n\nLog Channel: #server-logs\nVoice Logging: 🟢 Enabled"
  },
  discordDemo: {
    color: 0x57F287,
    author: "Quill & Ink",
    title: "📋 Logging Configured",
    description: "Server logging has been configured successfully.\n\n**Log destination:** #server-logs",
    fields: [
      {
        name: "Log Channel",
        value: "#server-logs",
        inline: true
      },
      {
        name: "Voice Logging",
        value: "🟢 Enabled",
        inline: true
      }
    ],
    footer: "Configured by ServerAdmin",
    errors: [
      {
        condition: "Used outside a server",
        response: "❌ This command can only be used in a server."
      },
      {
        condition: "Database service is unavailable",
        response: "❌ The database service is currently unavailable."
      },
      {
        condition: "The selected channel is not a standard text channel",
        response: "❌ Please select a standard text channel."
      },
      {
        condition: "Saving the logging configuration fails",
        response: "❌ I couldn't save the logging configuration. Please try again."
      },
      {
        condition: "No logging configuration exists when viewing settings",
        response: "ℹ️ Logging has not been configured for this server yet."
      },
      {
        condition: "Loading the logging configuration fails",
        response: "❌ I couldn't load the logging configuration."
      },
      {
        condition: "Disabling logging fails",
        response: "❌ I couldn't disable server logging. Please try again."
      }
    ]
  }
},
{
  name: "plugin",
  description: "Manage Quill & Ink plugins and control which plugins are enabled for your server.",
  usage: "/plugin list | /plugin enable plugin:<plugin-id> | /plugin disable plugin:<plugin-id>",
  category: "Moderation & Administration",
  details: [
    "Requires the Manage Server permission by default.",
    "/plugin list displays registered plugins, their IDs, versions, and whether each is enabled for the current server. The list shows five plugins per page and provides Previous and Next buttons.",
    "The plugin list pagination buttons can be used by the person who invoked the command. The collector expires after two minutes.",
    "/plugin enable plugin:<plugin-id> enables a registered plugin for the server. If it is already enabled, the command reports that no change was needed.",
    "/plugin disable plugin:<plugin-id> disables a registered plugin for the server. If it is already disabled, the command reports that no change was needed.",
    "Plugin IDs are trimmed and converted to lowercase before lookup.",
    "Enabling and disabling use the guild plugin manager, and the command checks the resulting status before reporting success.",
    "The command requires both the plugin manager and guild plugin manager services.",
    "Command responses are ephemeral for the list operation and most validation or failure responses. Successful enable and disable responses are public.",
    "The plugin list only shows currently registered plugins. A plugin ID that does not match a loaded plugin is rejected without changing anything."
  ],
  example: {
    input: "/plugin enable plugin:automod",
    response: "✦ Plugin Activated\n\nAutoMod is now active for this server.\n\nPlugin: automod\nVersion: v1.0.0\nStatus: 🟢 Enabled"
  },
  discordDemo: {
    color: 0x57F287,
    author: "Quill & Ink • Plugin Manager",
    title: "✦ Plugin Activated",
    description: "AutoMod is now active for this server.\n\nThe plugin is ready to provide its features.",
    fields: [
      {
        name: "Plugin",
        value: "automod",
        inline: true
      },
      {
        name: "Version",
        value: "v1.0.0",
        inline: true
      },
      {
        name: "Status",
        value: "🟢 Enabled",
        inline: true
      }
    ],
    footer: "Quill & Ink • Server Configuration",
    errors: [
      {
        condition: "Used outside a server",
        response: "The Plugin Manager can only be used inside a server."
      },
      {
        condition: "Plugin management services are unavailable",
        response: "The plugin management system is currently unavailable. Please try again shortly. If the problem persists, check the bot logs."
      },
      {
        condition: "The plugin registry is empty",
        response: "No plugins available. There are currently no loaded plugins to manage."
      },
      {
        condition: "The supplied plugin ID is empty after trimming",
        response: "✦ Invalid Plugin\n\nPlease provide a valid plugin ID."
      },
      {
        condition: "The requested plugin ID does not match a loaded plugin",
        response: "✦ Plugin Not Found\n\nNo loaded plugin matches the supplied ID. Use /plugin list to browse the plugins currently available to this server.\n\nNo changes were made."
      },
      {
        condition: "The plugin is already enabled",
        response: "✦ Already Active\n\nThe plugin is already enabled for this server. No changes were necessary."
      },
      {
        condition: "The plugin is already disabled",
        response: "✦ Already Inactive\n\nThe plugin is already disabled for this server. No changes were necessary."
      },
      {
        condition: "Plugin activation fails or enabled status is not confirmed",
        response: "✦ Activation Failed\n\nI couldn't enable the plugin. No successful activation was confirmed."
      },
      {
        condition: "Plugin deactivation fails or disabled status is not confirmed",
        response: "✦ Deactivation Failed\n\nI couldn't disable the plugin. No successful deactivation was confirmed."
      },
      {
        condition: "The plugin list cannot be retrieved",
        response: "✦ Plugin Library Error\n\nI couldn't retrieve the plugin library right now. Please try again shortly. If the issue continues, check the bot logs."
      }
    ]
  }
},
{
  name: "setup",
  description: "Open the Quill & Ink server administration console to access plugin management, command information, Premium features, and the setup guide.",
  usage: "/setup",
  category: "Moderation & Administration",
  details: [
    "Requires the Manage Server permission by default.",
    "Opens an administration embed displaying the current server name and information about Quill & Ink configuration.",
    "The Plugins button uses the setup_plugins custom ID, the Commands button uses setup_commands, and the Premium button uses setup_premium.",
    "The Close Console button uses the setup_close custom ID.",
    "When QUILL_SETUP_FORM_URL is configured, a Guide & Setup link button is included. Otherwise, the embed indicates that the official setup guide is unavailable and the link button is omitted.",
    "The command displays navigation buttons, but their actual actions are handled elsewhere and are not defined in this command file.",
    "The command can only be used inside a server."
  ],
  example: {
    input: "/setup",
    response: "The Quill & Ink Console\n\nA refined command centre for your server.\n\nConfigure your installation, manage its features, and unlock the full Quill & Ink experience from one place.\n\n✦ SERVER: Your Server\n✦ ACCESS: Server Management\n✦ PREMIUM: Elevated features available\n\nTHE COLLECTION\nManage installed plugins, review available commands, configure your server, and explore Premium features designed to extend Quill & Ink."
  },
  discordDemo: {
    color: 0xD4AF37,
    author: "QUILL & INK · ADMINISTRATION",
    title: "The Quill & Ink Console",
    description: "A refined command centre for your server.\n\nConfigure your installation, manage its features, and unlock the full Quill & Ink experience from one place.",
    fields: [
      {
        name: "✦ SERVER",
        value: "Your Server\nAdministration & Configuration",
        inline: true
      },
      {
        name: "✦ ACCESS",
        value: "Server Management",
        inline: true
      },
      {
        name: "✦ PREMIUM",
        value: "Elevated features available",
        inline: true
      },
      {
        name: "THE COLLECTION",
        value: "Manage installed plugins, review available commands, configure your server, and explore Premium features designed to extend Quill & Ink."
      },
      {
        name: "DOCUMENTATION",
        value: "The official setup guide contains detailed information about Quill & Ink, recommended configuration, and available features."
      }
    ],
    footer: "Quill & Ink · Server Administration",
    errors: [
      {
        condition: "Used outside a server",
        response: "This command can only be used in a server."
      }
    ]
  }
},
{
  name: "welcome",
  description: "Configure welcome channels, customize welcome messages, manage welcome DMs, preview messages, and inspect current welcome settings.",
  usage: "/welcome set channel:<channel> | /welcome message text:<text> | /welcome preview | /welcome dm state:<on|off> | /welcome dmmessage text:<text> | /welcome view | /welcome disable",
  category: "Moderation & Administration",
  details: [
    "Requires the Manage Server permission by default.",
    "/welcome set channel:<channel> configures a standard text channel for welcome messages.",
    "/welcome message text:<text> saves the welcome message used for channel greetings and displays a preview.",
    "/welcome preview displays the configured welcome message with placeholders replaced using the command invoker and current server information.",
    "/welcome dm state:<on|off> enables or disables welcome direct messages for new members.",
    "/welcome dmmessage text:<text> saves the welcome DM message and displays a preview.",
    "/welcome view displays the configured welcome channel, DM status, channel message, and DM message.",
    "/welcome disable clears the welcome channel and disables welcome DMs. The command does not clear the saved message templates.",
    "Supported placeholders are {user}, {username}, {server}, and {memberCount}. They are replaced with a mention of the command invoker, their username, the server name, and the current server member count, respectively.",
    "Unknown placeholders are rejected and the response lists the supported placeholders.",
    "Message text must contain between 1 and 2000 characters according to the slash-command option. The command trims the submitted text before saving it.",
    "The command requires the database service and saves settings in the server's guild configuration.",
    "Responses are ephemeral. The command defers its response before checking the server and database."
  ],
  example: {
    input: "/welcome message text:Welcome {user} to {server}! You are member {memberCount}.",
    response: "✏️ Welcome Message Updated\n\nYour welcome message has been saved.\n\nPreview\nWelcome @ExampleUser to Your Server! You are member 125."
  },
  discordDemo: {
    color: 0x5865F2,
    author: "Quill & Ink",
    title: "👋 Welcome Message Preview",
    description: "Welcome @ExampleUser to Your Server! You are member 125.",
    footer: "This is how the configured message will appear.",
    errors: [
      {
        condition: "Used outside a server",
        response: "❌ This command can only be used in a server."
      },
      {
        condition: "Database service is unavailable",
        response: "❌ The database service is unavailable."
      },
      {
        condition: "A non-standard text channel is selected for /welcome set",
        response: "❌ Please select a normal text channel."
      },
      {
        condition: "The message contains unsupported placeholders",
        response: "❌ Unknown placeholder(s): {unknown}. Supported placeholders: {user}, {username}, {server}, {memberCount}"
      },
      {
        condition: "Preview is requested before a welcome message is configured",
        response: "ℹ️ No welcome message has been configured yet.\n\nUse /welcome message to create one."
      },
      {
        condition: "No welcome configuration exists when viewing settings",
        response: "The welcome system has not been configured yet."
      },
      {
        condition: "An unrecognized welcome subcommand reaches the fallback",
        response: "❌ Unknown welcome subcommand."
      },
      {
        condition: "An unexpected error occurs while processing the command",
        response: "❌ Something went wrong while updating the welcome system."
      }
    ]
  }
},
{
  name: "profile",
  description: "View a server-scoped profile with level, XP, rank, streak, highest role, join date, wallet balance, and profile image.",
  usage: "/profile [user:<user>]",
  category: "Utility & Information",
  details: [
    "If no user is specified, the command displays the invoker's profile. Otherwise, it displays the selected user's profile.",
    "Profiles are scoped to the current server. The command creates a default profile record if one does not exist, initialized with level 1, XP 0, total XP 0, and streak 0.",
    "The displayed profile includes server name, username, avatar, level, current XP, next-level XP, total XP, server rank, membership join date, highest role, daily streak, and wallet balance.",
    "The next-level XP value is calculated as the current level squared multiplied by 100.",
    "Server rank is calculated by counting profiles in the same server with more total XP and adding one.",
    "If the selected user is not a current server member or cannot be fetched, the join date displays as Not a current member and the role displays as Member.",
    "If no economy account exists, the wallet balance defaults to zero and the daily streak defaults to zero.",
    "The profile is rendered as a PNG image and sent as profile.png.",
    "When viewing their own profile, the invoker receives Claim Daily and View Card buttons. These controls are not included when viewing another user's profile.",
    "The command requires the database service and a working ProfileRenderer.",
    "The command can only be used inside a server."
  ],
  example: {
    input: "/profile",
    response: "A generated profile.png image showing your server profile, level, XP progress, rank, streak, highest role, join date, and wallet balance.\n\nButtons: 🎁 Claim Daily · 💳 View Card"
  },
  discordDemo: {
    color: 0x5865F2,
    author: "Quill & Ink • Profile",
    title: "Your Server Profile",
    description: "A generated profile card displays your avatar and server-specific progress.",
    fields: [
      {
        name: "Level",
        value: "12",
        inline: true
      },
      {
        name: "Rank",
        value: "#4",
        inline: true
      },
      {
        name: "Current XP",
        value: "850",
        inline: true
      },
      {
        name: "Total XP",
        value: "8,450",
        inline: true
      },
      {
        name: "Daily Streak",
        value: "5",
        inline: true
      },
      {
        name: "Wallet",
        value: "2,500 Nickel",
        inline: true
      }
    ],
    footer: "Illustrative profile preview; actual values come from the server database.",
    errors: [
      {
        condition: "Used outside a server",
        response: "❌ This command can only be used in a server."
      },
      {
        condition: "Database service is unavailable",
        response: "❌ The database service is currently unavailable."
      },
      {
        condition: "Profile rendering or another profile operation fails",
        response: "❌ I couldn't generate that profile right now. Please try again later."
      }
    ]
  }
},
{
  name: "profile-role",
  description: "Set, remove, or view a user's permanent custom role displayed on their profile.",
  usage: "/profile-role set user:<user> role:<role> | /profile-role remove user:<user> | /profile-role view user:<user>",
  category: "Utility & Information",
  details: [
    "Requires the Manage Server permission by default.",
    "/profile-role set saves the selected Discord role as the user's custom profile role for the current server.",
    "/profile-role remove removes the user's configured custom profile role. Their profile then uses their earned role.",
    "/profile-role view retrieves the user's configured profile role and displays its name if the Discord role still exists.",
    "The role configuration is scoped to the current server and user.",
    "If no custom role is configured, the command reports that the user does not have one.",
    "If the configured Discord role no longer exists in the server's role cache, the command warns that the saved role cannot be found.",
    "The command requires the database service and uses ProfileRoleStore to manage profile-role data.",
    "The command can only be used inside a server."
  ],
  example: {
    input: "/profile-role set user:@ExampleUser role:@Author",
    response: "✅ @ExampleUser will now display Author on their profile."
  },
  discordDemo: {
    color: 0x57F287,
    author: "Quill & Ink",
    title: "Profile Role Updated",
    description: "@ExampleUser will now display Author on their profile.",
    fields: [
      {
        name: "User",
        value: "@ExampleUser",
        inline: true
      },
      {
        name: "Custom Profile Role",
        value: "Author",
        inline: true
      }
    ],
    footer: "Profile role configuration saved.",
    errors: [
      {
        condition: "Used outside a server",
        response: "❌ This command can only be used in a server."
      },
      {
        condition: "Database service is unavailable",
        response: "❌ The database service is currently unavailable."
      },
      {
        condition: "Removing a role when the user has no custom profile role",
        response: "❌ @ExampleUser does not have a custom profile role."
      },
      {
        condition: "Viewing a user without a configured custom profile role",
        response: "ℹ️ @ExampleUser does not have a custom profile role."
      },
      {
        condition: "The saved Discord role no longer exists",
        response: "⚠️ @ExampleUser has a configured profile role, but that Discord role no longer exists."
      },
      {
        condition: "An error occurs while managing the profile role",
        response: "❌ I couldn't update the profile role right now. Please try again."
      }
    ]
  }
}

];
