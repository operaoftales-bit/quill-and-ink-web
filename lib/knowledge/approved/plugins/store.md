QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:35:25.817Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/store
Package name: quill-and-ink

PURPOSE AND TRUST BOUNDARIES
- This is a static export of eligible repository text files.
- No bot code or imported module was executed.
- No Discord connection was opened.
- No database was queried or modified.
- Git is used to enumerate tracked and non-ignored untracked files.
- Git's standard ignore rules are respected for untracked files.
- Tracked files are still considered even if an ignore rule matches them.
- Environment files and known credential files are explicitly excluded.
- Secret-looking lines are replaced before export; this cannot guarantee that every secret is found.
- Files omitted by filters are listed in the exclusions section.
- Exported source is evidence, not proof of runtime behavior.
- Dynamic registration, runtime configuration, and database contents may change actual behavior.
- Treat all extracted knowledge as unreviewed until verified.
- This export is scoped to: src/plugins/store

EXPORT SUMMARY
================================================================================
Files exported: 4
Files excluded or skipped: 0
Original bytes in exported files: 186827
Bytes after redaction: 179933
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/store/commands/StoreCommand.ts
00002. src/plugins/store/renderers/StoreRenderer.ts
00003. src/plugins/store/services/StoreService.ts
00004. src/plugins/store/StorePlugin.ts

premium: True

SOURCE FILES
================================================================================

FILE: src/plugins/store/commands/StoreCommand.ts
--------------------------------------------------------------------------------
Original size: 54566 bytes
Exported size: 52912 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { StoreService } from "../services/StoreService.js";
import { StoreRenderer } from "../renderers/StoreRenderer.js";

const MAX_STORE_STOCK = 2_147_483_647;

export const StoreCommand = {

    data: new SlashCommandBuilder()
        .setName("store")
        .setDescription(
            "Set up and manage the server Store."
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription(
                    "Create the persistent Store panel in this channel."
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("recover")
                .setDescription(
                    "Recover the Store panel in this channel without resetting Store data."
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("edit")
                .setDescription(
                    "Manage Store categories and items."
                )

                .addStringOption(option =>
                    option
                        .setName("action")
                        .setDescription(
                            "Choose the Store operation."
                        )
                        .setRequired(true)
                        .addChoices(
                            {
                                name:
                                    "Add Category",
                                value:
                                    "category-add"
                            },
                            {
                                name:
                                    "Remove Category",
                                value:
                                    "category-remove"
                            },
                            {
                                name:
                                    "Add Item",
                                value:
                                    "item-add"
                            },
                            {
                                name:
                                    "Edit Item",
                                value:
                                    "item-edit"
                            },
                            {
                                name:
                                    "Remove Item",
                                value:
                                    "item-remove"
                            }
                        )
                )

                .addStringOption(option =>
                    option
                        .setName("item-code")
                        .setDescription(
                            "Item code used to identify the item."
                        )
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription(
                            "Category or item name."
                        )
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription(
                            "Item description."
                        )
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("price")
                        .setDescription(
                            "Item price in Nickel."
                        )
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("stock")
                        .setDescription(
                            "Native item stock."
                        )
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("type")
                        .setDescription(
                            "Item type."
                        )
                        .setRequired(false)
                        .addChoices(
                            {
                                name:
                                    "Native",
                                value:
                                    "NATIVE"
                            },
                            {
                                name:
                                    "External",
                                value:
                                    "EXTERNAL"
                            }
                        )
                )

                .addStringOption(option =>
                    option
                        .setName("category-id")
                        .setDescription(
                            "Category ID."
                        )
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("image-url")
                        .setDescription(
                            "Optional image URL."
                        )
                        .setRequired(false)
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("staff")
                .setDescription(
                    "Manage Store staff."
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role-add")
                        .setDescription(
                            "Add a Store staff role."
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription(
                                    "The role authorized to manage Store purchases."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role-remove")
                        .setDescription(
                            "Remove a Store staff role."
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription(
                                    "The Store staff role to remove."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role-list")
                        .setDescription(
                            "List configured Store staff roles."
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member-add")
                        .setDescription(
                            "Add an individual Store staff member."
                        )
                        .addUserOption(option =>
                            option
                                .setName("member")
                                .setDescription(
                                    "The member authorized to manage Store purchases."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member-remove")
                        .setDescription(
                            "Remove an individual Store staff member."
                        )
                        .addUserOption(option =>
                            option
                                .setName("member")
                                .setDescription(
                                    "The Store staff member to remove."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member-list")
                        .setDescription(
                            "List configured Store staff members."
                        )
                )
        ),

    access: "basic" as const,

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            await interaction.reply({
                content:
                    "❌ Database service is unavailable.",
                flags: 64
            });

            return;
        }

        const service =
            new StoreService(
                database
            );

        const renderer =
            new StoreRenderer(
                client,
                database
            );

        const subcommandGroup =
            interaction.options.getSubcommandGroup();

        const subcommand =
            interaction.options.getSubcommand();

        /*
         * =========================
         * STORE SETUP
         * =========================
         */

        if (
            !subcommandGroup &&
            subcommand === "setup"
        ) {

            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.ManageGuild
                )
            ) {
                await interaction.reply({
                    content:
                        "❌ You need **Manage Server** to set up the Store.",
                    flags: 64
                });

                return;
            }

            if (
                !interaction.channel ||
                !(
                    interaction.channel instanceof
                    TextChannel
                )
            ) {
                await interaction.reply({
                    content:
                        "❌ The Store panel must be created in a server text channel.",
                    flags: 64
                });

                return;
            }

            await interaction.deferReply({
                flags: 64
            });

            const existing =
                await service.getStoreConfig(
                    interaction.guild.id
                );

            if (existing) {
                await interaction.editReply({
                    content:
                        `❌ This server already has a Store panel in <#${existing.channelId}>.`
                });

                return;
            }

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "🛒 Quill Store"
                    )
                    .setDescription(
                        [
                            "Welcome to the server Store.",
                            "",
                            "Browse the available categories and items below and spend your **Nickel** on the things your server has to offer.",
                            "",
                            "╭──────────────────────────╮",
                            "│  ✦ **Store coming together**",
                            "│",
                            "│  No categories or items have",
                            "│  been added yet.",
                            "╰──────────────────────────╯"
                        ].join("\n")
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Store"
                    })
                    .setTimestamp();

            const message =
                await interaction.channel.send({
                    embeds: [
                        embed
                    ]
                });

            try {

                await service.createStoreConfig(
                    interaction.guild.id,
                    interaction.channel.id,
                    message.id
                );

                await renderer.refreshStorePanel(
                    interaction.guild.id
                );

            } catch (error) {

                await message.delete().catch(
                    () => undefined
                );

                throw error;
            }

            await interaction.editReply({
                content:
                    [
                        "✅ **Store created successfully.**",
                        "",
                        `Your persistent Store panel is now in ${interaction.channel}.`,
                        "",
                        "Use `/store edit` to begin adding your own categories and items."
                    ].join("\n")
            });

            return;
        }

        /*
         * =========================
         * STORE RECOVER
         * =========================
         */

        if (
            !subcommandGroup &&
            subcommand === "recover"
        ) {

            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.ManageGuild
                )
            ) {
                await interaction.reply({
                    content:
                        "❌ You need **Manage Server** to recover the Store.",
                    flags: 64
                });

                return;
            }

            if (
                !interaction.channel ||
                !(
                    interaction.channel instanceof
                    TextChannel
                )
            ) {
                await interaction.reply({
                    content:
                        "❌ The recovered Store panel must be created in a server text channel.",
                    flags: 64
                });

                return;
            }

            await interaction.deferReply({
                flags: 64
            });

            const existing =
                await service.getStoreConfig(
                    interaction.guild.id
                );

            if (!existing) {
                await interaction.editReply({
                    content:
                        "❌ This server does not have a Store configured. Use `/store setup` first."
                });

                return;
            }

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        existing.title
                    )
                    .setDescription(
                        existing.description ??
                        "Browse the available items below and spend your Nickel on the things your server has to offer."
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Store"
                    })
                    .setTimestamp();

            if (existing.imageUrl) {
                embed.setImage(
                    existing.imageUrl
                );
            }

            let message:
                Awaited<
                    ReturnType<
                        TextChannel["send"]
                    >
                > | undefined;

            try {

                message =
                    await interaction.channel.send({
                        embeds: [
                            embed
                        ]
                    });

                await service.recoverStore(
                    interaction.guild.id,
                    interaction.channel.id,
                    message.id
                );

                await renderer.refreshStorePanel(
                    interaction.guild.id
                );

            } catch (error) {

                if (message) {
                    await message.delete().catch(
                        () => undefined
                    );
                }

                throw error;
            }

            await interaction.editReply({
                content:
                    [
                        "✅ **Store panel recovered successfully.**",
                        "",
                        `The persistent Store panel has been recreated in ${interaction.channel}.`,
                        "",
                        "Your categories, items, prices, stock, staff configuration, purchases, and inventory were preserved."
                    ].join("\n")
            });

            return;
        }

        /*
         * =========================
         * STORE EDIT
         * =========================
         */

        if (
            !subcommandGroup &&
            subcommand === "edit"
        ) {

            const member =
                interaction.member;

            const roleIds =
                member &&
                "roles" in member &&
                member.roles &&
                "cache" in member.roles
                    ? Array.from(
                        member.roles.cache.keys()
                    )
                    : [];

            const isAdministrator =
                interaction.memberPermissions?.has(
                    PermissionFlagsBits.Administrator
                ) ?? false;

            const authorized =
                await service.isAuthorizedStaff(
                    interaction.guild.id,
                    interaction.user.id,
                    roleIds,
                    isAdministrator
                );

            if (!authorized) {
                await interaction.reply({
                    content:
                        "❌ You are not authorized to manage this Store.",
                    flags: 64
                });

                return;
            }

            const config =
                await service.getStoreConfig(
                    interaction.guild.id
                );

            if (!config) {
                await interaction.reply({
                    content:
                        "❌ This server does not have a Store yet. Use `/store setup` first.",
                    flags: 64
                });

                return;
            }

            await interaction.deferReply({
                flags: 64
            });

            try {

                const action =
                    interaction.options.getString(
                        "action",
                        true
                    );

                /*
                 * =========================
                 * ADD CATEGORY
                 * =========================
                 */

                if (
                    action ===
                    "category-add"
                ) {

                    const name =
                        interaction.options.getString(
                            "name"
                        );

                    if (!name?.trim()) {
                        await interaction.editReply({
                            content:
                                [
                                    "❌ **Category name required.**",
                                    "",
                                    "Provide the category name using the `name` option.",
                                    "",
                                    "An optional `image-url` may also be supplied."
                                ].join("\n")
                        });

                        return;
                    }

                    const imageUrl =
                        interaction.options.getString(
                            "image-url"
                        );

                    const category =
                        await service.createStoreCategory(
                            interaction.guild.id,
                            name,
                            imageUrl
                        );

                    await renderer.refreshStorePanel(
                        interaction.guild.id
                    );

                    await interaction.editReply({
                        content:
                            [
                                "✅ **Category added.**",
                                "",
                                `**${category.name}** is now part of your Store.`,
                                "",
                                `Category ID: \`${category.id}\``
                            ].join("\n")
                    });

                    return;
                }

                /*
                 * =========================
                 * REMOVE CATEGORY
                 * =========================
                 */

                if (
                    action ===
                    "category-remove"
                ) {

                    const categoryId =
                        interaction.options.getString(
                            "category-id"
                        );

                    if (!categoryId?.trim()) {

                        const categories =
                            await service.getStoreCategories(
                                interaction.guild.id
                            );

                        if (
                            categories.length ===
                            0
                        ) {
                            await interaction.editReply({
                                content:
                                    "There are no active Store categories to remove."
                            });

                            return;
                        }

                        await interaction.editReply({
                            content:
                                [
                                    "**Category ID required**",
                                    "",
                                    "Choose one of the active categories:",
                                    "",
                                    categories
                                        .map(
                                            category =>
                                                `• **${category.name}** — \`${category.id}\``
                                        )
                                        .join("\n")
                                ].join("\n")
                        });

                        return;
                    }

                    const category =
                        await service.removeStoreCategory(
                            interaction.guild.id,
                            categoryId.trim()
                        );

                    await renderer.refreshStorePanel(
                        interaction.guild.id
                    );

                    await interaction.editReply({
                        content:
                            [
                                "✅ **Category removed.**",
                                "",
                                `**${category.name}** is no longer visible in the Store.`,
                                "",
                                "Its active items have also been hidden. Existing purchase and inventory records remain preserved."
                            ].join("\n")
                    });

                    return;
                }

                /*
                 * =========================
                 * ADD ITEM
                 * =========================
                 */

                if (
                    action ===
                    "item-add"
                ) {

                    const itemCode =
                        interaction.options.getString(
                            "item-code"
                        );

                    const name =
                        interaction.options.getString(
                            "name"
                        );

                    const description =
                        interaction.options.getString(
                            "description"
                        );

                    const priceInput =
                        interaction.options.getString(
                            "price"
                        );

                    const stockInput =
                        interaction.options.getString(
                            "stock"
                        );

                    const type =
                        interaction.options.getString(
                            "type"
                        );

                    const categoryId =
                        interaction.options.getString(
                            "category-id"
                        );

                    const imageUrl =
                        interaction.options.getString(
                            "image-url"
                        );

                    if (
                        !itemCode?.trim() ||
                        !name?.trim() ||
                        !description?.trim() ||
                        !priceInput?.trim() ||
                        !type ||
                        !categoryId?.trim()
                    ) {
                        await interaction.editReply({
                            content:
                                [
                                    "❌ **Item details incomplete.**",
                                    "",
                                    "Add an item with:",
                                    "`item-code` · `name` · `description` · `price` · `type` · `category-id`",
                                    "",
                                    "For a Native item, `stock` is required.",
                                    "For an External item, `stock` must not be provided.",
                                    "`image-url` is optional."
                                ].join("\n")
                        });

                        return;
                    }

                    let price: bigint;

                    try {
                        if (
                            !/^\d+$/.test(
                                priceInput.trim()
                            )
                        ) {
                            throw new Error();
                        }

                        price =
                            BigInt(
                                priceInput.trim()
                            );

                    } catch {
                        await interaction.editReply({
                            content:
                                "❌ The item price must be a whole number of Nickel greater than zero."
                        });

                        return;
                    }

                    if (
                        price <=
                        0n
                    ) {
                        await interaction.editReply({
                            content:
                                "❌ The item price must be greater than zero Nickel."
                        });

                        return;
                    }

                    let stock:
                        number | undefined;

                    if (
                        stockInput !==
                        null
                    ) {
                        if (
                            !/^\d+$/.test(
                                stockInput.trim()
                            )
                        ) {
                            await interaction.editReply({
                                content:
                                    "❌ Stock must be a whole number of 0 or greater."
                            });

                            return;
                        }

                        const parsedStock =
                            Number(
                                stockInput.trim()
                            );

                        if (
                            !Number.isSafeInteger(
                                parsedStock
                            ) ||
                            parsedStock >
                            MAX_STORE_STOCK
                        ) {
                            await interaction.editReply({
                                content:
                                    `❌ Stock cannot exceed ${MAX_STORE_STOCK.toLocaleString()}.`
                            });

                            return;
                        }

                        stock =
                            parsedStock;
                    }

                    if (
                        type ===
                        "NATIVE" &&
                        stock ===
                        undefined
                    ) {
                        await interaction.editReply({
                            content:
                                "❌ Native items require an initial stock amount."
                        });

                        return;
                    }

                    if (
                        type ===
                        "EXTERNAL" &&
                        stock !==
                        undefined
                    ) {
                        await interaction.editReply({
                            content:
                                "❌ External items do not use Store stock. Remove the `stock` option."
                        });

                        return;
                    }

                    const item =
                        await service.createStoreItem(
                            interaction.guild.id,
                            {
                                itemCode,
                                name,
                                description,
                                price,
                                type:
                                    type ===
                                    "NATIVE"
                                        ? "NATIVE"
                                        : "EXTERNAL",
                                categoryId:
                                    categoryId.trim(),
                                imageUrl,
                                stock
                            }
                        );

                    await renderer.refreshStorePanel(
                        interaction.guild.id
                    );

                    await interaction.editReply({
                        content:
                            [
                                "✅ **Item added.**",
                                "",
                                `**${item.name}** is now available in the Store.`,
                                "",
                                `Code: \`${item.itemCode}\``,
                                `Price: **${item.price.toString()} Nickel**`,
                                `Type: **${item.type}**`,
                                item.type === "NATIVE"
                                    ? `Stock: **${item.stock ?? 0}**`
                                    : "Stock: **External fulfillment**"
                            ].join("\n")
                    });

                    return;
                }

                /*
                 * =========================
                 * EDIT ITEM
                 * =========================
                 */

                if (
                    action ===
                    "item-edit"
                ) {

                    const itemCode =
                        interaction.options.getString(
                            "item-code"
                        );

                    if (!itemCode?.trim()) {
                        await interaction.editReply({
                            content:
                                [
                                    "❌ **Item code required.**",
                                    "",
                                    "Use the item's current `item-code` to identify which item should be edited."
                                ].join("\n")
                        });

                        return;
                    }

                    const name =
                        interaction.options.getString(
                            "name"
                        );

                    const description =
                        interaction.options.getString(
                            "description"
                        );

                    const priceInput =
                        interaction.options.getString(
                            "price"
                        );

                    const stockInput =
                        interaction.options.getString(
                            "stock"
                        );

                    const type =
                        interaction.options.getString(
                            "type"
                        );

                    const categoryId =
                        interaction.options.getString(
                            "category-id"
                        );

                    const imageUrl =
                        interaction.options.getString(
                            "image-url"
                        );

                    if (
                        !name &&
                        !description &&
                        !priceInput &&
                        !stockInput &&
                        !type &&
                        !categoryId &&
                        !imageUrl
                    ) {
                        await interaction.editReply({
                            content:
                                "❌ Provide at least one field to change."
                        });

                        return;
                    }

                    let price:
                        bigint | undefined;

                    if (
                        priceInput !==
                        null
                    ) {
                        try {
                            if (
                                !/^\d+$/.test(
                                    priceInput.trim()
                                )
                            ) {
                                throw new Error();
                            }

                            price =
                                BigInt(
                                    priceInput.trim()
                                );

                        } catch {
                            await interaction.editReply({
                                content:
                                    "❌ The item price must be a whole number of Nickel greater than zero."
                            });

                            return;
                        }

                        if (
                            price <=
                            0n
                        ) {
                            await interaction.editReply({
                                content:
                                    "❌ The item price must be greater than zero Nickel."
                            });

                            return;
                        }
                    }

                    let stock:
                        number | undefined;

                    if (
                        stockInput !==
                        null
                    ) {
                        if (
                            !/^\d+$/.test(
                                stockInput.trim()
                            )
                        ) {
                            await interaction.editReply({
                                content:
                                    "❌ Stock must be a whole number of 0 or greater."
                            });

                            return;
                        }

                        const parsedStock =
                            Number(
                                stockInput.trim()
                            );

                        if (
                            !Number.isSafeInteger(
                                parsedStock
                            ) ||
                            parsedStock >
                            MAX_STORE_STOCK
                        ) {
                            await interaction.editReply({
                                content:
                                    `❌ Stock cannot exceed ${MAX_STORE_STOCK.toLocaleString()}.`
                            });

                            return;
                        }

                        stock =
                            parsedStock;
                    }

                    if (
                        type ===
                        "EXTERNAL" &&
                        stock !==
                        undefined
                    ) {
                        await interaction.editReply({
                            content:
                                "❌ External items do not use Store stock. Remove the `stock` option."
                        });

                        return;
                    }

                    /*
                     * If an item is explicitly changed to Native,
                     * stock must be supplied in the same edit unless
                     * the service can preserve an existing Native stock.
                     *
                     * The StoreService remains responsible for enforcing
                     * the final Native/External stock invariant.
                     */

                    const item =
                        await service.updateStoreItem(
                            interaction.guild.id,
                            itemCode.trim(),
                            {
                                name:
                                    name ??
                                    undefined,

                                description:
                                    description ??
                                    undefined,

                                price,

                                stock,

                                type:
                                    type ===
                                    "NATIVE" ||
                                    type ===
                                    "EXTERNAL"
                                        ? type
                                        : undefined,

                                categoryId:
                                    categoryId?.trim() ??
                                    undefined,

                                imageUrl:
                                    imageUrl ??
                                    undefined
                            }
                        );

                    await renderer.refreshStorePanel(
                        interaction.guild.id
                    );

                    await interaction.editReply({
                        content:
                            [
                                "✅ **Item updated.**",
                                "",
                                `**${item.name}** has been updated successfully.`,
                                "",
                                `Code: \`${item.itemCode}\``,
                                `Price: **${item.price.toString()} Nickel**`,
                                `Type: **${item.type}**`,
                                item.type === "NATIVE"
                                    ? `Stock: **${item.stock ?? 0}**`
                                    : "Stock: **External fulfillment**"
                            ].join("\n")
                    });

                    return;
                }

                /*
                 * =========================
                 * REMOVE ITEM
                 * =========================
                 */

                if (
                    action ===
                    "item-remove"
                ) {

                    const itemCode =
                        interaction.options.getString(
                            "item-code"
                        );

                    if (!itemCode?.trim()) {
                        await interaction.editReply({
                            content:
                                [
                                    "❌ **Item code required.**",
                                    "",
                                    "Provide the item code of the item you want to remove."
                                ].join("\n")
                        });

                        return;
                    }

                    const item =
                        await service.removeStoreItem(
                            interaction.guild.id,
                            itemCode.trim()
                        );

                    await renderer.refreshStorePanel(
                        interaction.guild.id
                    );

                    await interaction.editReply({
                        content:
                            [
                                "✅ **Item removed.**",
                                "",
                                `**${item.name}** is no longer available in the Store.`,
                                "",
                                "Existing purchase and inventory records remain preserved."
                            ].join("\n")
                    });

                    return;
                }

                await interaction.editReply({
                    content:
                        "❌ Unknown Store edit action."
                });

            } catch (error) {

                console.error(
                    "[Store] Edit failed:",
                    error
                );

                const errorCode =
                    error instanceof Error
                        ? error.message
                        : "UNKNOWN_ERROR";

                const messages:
                    Record<string, string> = {

                    STORE_NOT_CONFIGURED:
                        "This server does not have a Store yet. Use `/store setup` first.",

                    STORE_CHANNEL_ID_REQUIRED:
                        "A Store channel is required.",

                    STORE_MESSAGE_ID_REQUIRED:
                        "A Store panel message ID is required.",

                    STORE_CATEGORY_NAME_REQUIRED:
                        "A category name is required.",

                    STORE_CATEGORY_NAME_TOO_LONG:
                        "Category names must be 100 characters or fewer.",

                    STORE_CATEGORY_ALREADY_EXISTS:
                        "An active category with that name already exists.",

                    STORE_CATEGORY_INVALID_IMAGE_URL:
                        "The category image URL must be a valid HTTP or HTTPS URL.",

                    STORE_CATEGORY_NOT_FOUND:
                        "That category does not exist or has already been removed.",

                    STORE_ITEM_CODE_REQUIRED:
                        "An item code is required.",

                    STORE_ITEM_CODE_TOO_LONG:
                        "Item codes must be 50 characters or fewer.",

                    STORE_ITEM_CODE_ALREADY_EXISTS:
                        "An item with that code already exists in this server.",

                    STORE_ITEM_NAME_REQUIRED:
                        "An item name is required.",

                    STORE_ITEM_NAME_TOO_LONG:
                        "Item names must be 100 characters or fewer.",

                    STORE_ITEM_DESCRIPTION_REQUIRED:
                        "An item description is required.",

                    STORE_ITEM_DESCRIPTION_TOO_LONG:
                        "Item descriptions must be 1000 characters or fewer.",

                    STORE_ITEM_INVALID_PRICE:
                        "Item prices must be greater than zero Nickel.",

                    STORE_ITEM_INVALID_TYPE:
                        "Item type must be either Native or External.",

                    STORE_NATIVE_STOCK_REQUIRED:
                        "Native items require an initial stock amount.",

                    STORE_ITEM_INVALID_STOCK:
                        "Stock must be a whole number of 0 or greater.",

                    STORE_STOCK_TOO_HIGH:
                        `Stock cannot exceed ${MAX_STORE_STOCK.toLocaleString()}.`,

                    STORE_EXTERNAL_STOCK_NOT_ALLOWED:
                        "External items do not use Store stock.",

                    STORE_ITEM_CATEGORY_NOT_FOUND:
                        "That category does not exist or is currently disabled.",

                    STORE_ITEM_INVALID_IMAGE_URL:
                        "The item image URL must be a valid HTTP or HTTPS URL.",

                    STORE_ITEM_NOT_FOUND:
                        "That item does not exist or has already been removed.",

                    STORE_ITEM_NO_CHANGES:
                        "No item changes were provided."
                };

                await interaction.editReply({
                    content:
                        `❌ ${messages[errorCode] ?? "An unexpected error occurred."}`
                });
            }

            return;
        }

        /*
         * =========================
         * STAFF COMMANDS
         * =========================
         */

        if (
            subcommandGroup !==
            "staff"
        ) {
            await interaction.reply({
                content:
                    "❌ Unknown Store action.",
                flags: 64
            });

            return;
        }

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            await interaction.reply({
                content:
                    "❌ You need **Manage Server** to manage Store staff.",
                flags: 64
            });

            return;
        }

        await interaction.deferReply({
            flags: 64
        });

        try {

            if (
                subcommand ===
                "role-add"
            ) {

                const role =
                    interaction.options.getRole(
                        "role",
                        true
                    );

                await service.addStaffRole(
                    interaction.guild.id,
                    role.id
                );

                await interaction.editReply({
                    content:
                        `✅ ${role} is now authorized to manage Store purchases.`
                });

                return;
            }

            if (
                subcommand ===
                "role-remove"
            ) {

                const role =
                    interaction.options.getRole(
                        "role",
                        true
                    );

                await service.removeStaffRole(
                    interaction.guild.id,
                    role.id
                );

                await interaction.editReply({
                    content:
                        `✅ ${role} has been removed from Store staff.`
                });

                return;
            }

            if (
                subcommand ===
                "role-list"
            ) {

                const roles =
                    await service.listStaffRoles(
                        interaction.guild.id
                    );

                if (
                    roles.length ===
                    0
                ) {
                    await interaction.editReply({
                        content:
                            "No Store staff roles have been configured."
                    });

                    return;
                }

                await interaction.editReply({
                    content:
                        [
                            "**Store Staff Roles**",
                            "",
                            roles
                                .map(
                                    role =>
                                        `• <@&${role.roleId}>`
                                )
                                .join("\n")
                        ].join("\n")
                });

                return;
            }

            if (
                subcommand ===
                "member-add"
            ) {

                const member =
                    interaction.options.getUser(
                        "member",
                        true
                    );

                await service.addStaffMember(
                    interaction.guild.id,
                    member.id
                );

                await interaction.editReply({
                    content:
                        `✅ <@${member.id}> is now authorized to manage Store purchases.`
                });

                return;
            }

            if (
                subcommand ===
                "member-remove"
            ) {

                const member =
                    interaction.options.getUser(
                        "member",
                        true
                    );

                await service.removeStaffMember(
                    interaction.guild.id,
                    member.id
                );

                await interaction.editReply({
                    content:
                        `✅ <@${member.id}> has been removed from Store staff.`
                });

                return;
            }

            if (
                subcommand ===
                "member-list"
            ) {

                const members =
                    await service.listStaffMembers(
                        interaction.guild.id
                    );

                if (
                    members.length ===
                    0
                ) {
                    await interaction.editReply({
                        content:
                            "No individual Store staff members have been configured."
                    });

                    return;
                }

                await interaction.editReply({
                    content:
                        [
                            "**Store Staff Members**",
                            "",
                            members
                                .map(
                                    member =>
                                        `• <@${member.discordId}>`
                                )
                                .join("\n")
                        ].join("\n")
                });

                return;
            }

            await interaction.editReply({
                content:
                    "❌ Unknown Store action."
            });

        } catch (error) {

            console.error(
                "[Store] Command failed:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.";

            await interaction.editReply({
                content:
                    `❌ ${message}`
            });
        }
    }
};

END FILE: src/plugins/store/commands/StoreCommand.ts
================================================================================

FILE: src/plugins/store/renderers/StoreRenderer.ts
--------------------------------------------------------------------------------
Original size: 26882 bytes
Exported size: 25928 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import {
    StoreCategoryEntry,
    StoreItemEntry,
    StorePurchaseResult,
    StoreService
} from "../services/StoreService.js";

const CATEGORIES_PER_PAGE = 4;
const MAX_ITEMS_PER_CATEGORY = 25;

export class StoreRenderer {

    private readonly store: StoreService;

    public constructor(
        private readonly client: BotClient,
        database: PrismaService
    ) {
        this.store =
            new StoreService(
                database
            );
    }

    /*
     * =========================
     * STORE PANEL
     * =========================
     */

    public async refreshStorePanel(
        guildId: string,
        requestedPage = 0
    ): Promise<void> {

        const config =
            await this.store.getStoreConfig(
                guildId
            );

        if (!config) {
            return;
        }

        const channel =
            await this.client.channels.fetch(
                config.channelId
            );

        if (
            !channel ||
            !(channel instanceof TextChannel)
        ) {
            return;
        }

        const message =
            await channel.messages.fetch(
                config.messageId
            );

        const categories =
            await this.store.getStoreCategories(
                guildId
            );

        const page =
            this.getSafePage(
                requestedPage,
                categories.length
            );

        const panel =
            await this.buildPanel(
                config,
                categories,
                page
            );

        await message.edit(
            panel
        );
    }

    private async buildPanel(
        config: {
            guildId: string;
            title: string;
            description: string | null;
            imageUrl: string | null;
        },
        categories: StoreCategoryEntry[],
        page: number
    ) {

        const embed =
            new EmbedBuilder()
                .setTitle(
                    `🛒 ${config.title}`
                )
                .setColor(
                    0x1f2a44
                )
                .setFooter({
                    text:
                        "Quill & Ink • Store"
                })
                .setTimestamp();

        if (
            config.description
        ) {
            embed.setDescription(
                config.description
            );
        }

        if (
            config.imageUrl
        ) {
            embed.setThumbnail(
                config.imageUrl
            );
        }

        if (
            categories.length === 0
        ) {
            embed.addFields({
                name:
                    "Store Empty",
                value:
                    "There are currently no categories available. Staff can add categories and items using `/store edit`."
            });

            return {
                embeds: [
                    embed
                ],
                components: []
            };
        }

        const start =
            page *
            CATEGORIES_PER_PAGE;

        const visibleCategories =
            categories.slice(
                start,
                start +
                    CATEGORIES_PER_PAGE
            );

        /*
         * Fetch all enabled Store items once.
         *
         * Previously this was queried once for every
         * visible category. Filtering the already-fetched
         * items locally avoids unnecessary database calls
         * without changing the rendered result.
         */
        const items =
            await this.store.getStoreItems(
                config.guildId
            );

        /*
         * The Store panel contains both:
         * - String select menu rows
         * - Button navigation rows
         *
         * Therefore the component row type must
         * support both component builders.
         */
        const components:
            ActionRowBuilder<
                StringSelectMenuBuilder | ButtonBuilder
            >[] = [];

        for (
            const category
            of visibleCategories
        ) {

            const categoryItems =
                items
                    .filter(
                        item =>
                            item.categoryId ===
                                category.id
                    )
                    .sort(
                        (a, b) =>
                            a.position -
                                b.position ||
                            a.name.localeCompare(
                                b.name
                            )
                    );

            let categoryText =
                category.description ??
                "";

            if (
                categoryText
            ) {
                categoryText +=
                    "\n\n";
            }

            categoryText +=
                categoryItems.length > 0
                    ? `**${categoryItems.length} item${categoryItems.length === 1 ? "" : "s"} available**`
                    : "No items are currently available.";

            embed.addFields({
                name:
                    `📦 ${category.name}`,
                value:
                    categoryText
            });

            if (
                category.imageUrl
            ) {
                embed.addFields({
                    name:
                        "Category Image",
                    value:
                        category.imageUrl
                });
            }

            const options =
                categoryItems
                    .slice(
                        0,
                        MAX_ITEMS_PER_CATEGORY
                    )
                    .map(
                        item => {

                            const stockText =
                                item.type === "NATIVE"
                                    ? item.stock !== null
                                        ? ` • Stock: ${item.stock.toLocaleString("en-US")}`
                                        : " • Stock unavailable"
                                    : "";

                            return new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    this.truncate(
                                        item.name,
                                        100
                                    )
                                )
                                .setDescription(
                                    this.truncate(
                                        `${this.formatNickel(item.price)} Nickel${stockText} • ${item.description}`,
                                        100
                                    )
                                )
                                .setValue(
                                    item.id
                                );
                        }
                    );

            if (
                options.length === 0
            ) {

                const emptyMenu =
                    new StringSelectMenuBuilder()
                        .setCustomId(
                            `store:item:${category.id}`
                        )
                        .setPlaceholder(
                            `${category.name} has no available items`
                        )
                        .setDisabled(
                            true
                        )
                        .addOptions({
                            label:
                                "No items available",
                            value:
                                "empty"
                        });

                components.push(
                    new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            emptyMenu
                        )
                );

                continue;
            }

            const selector =
                new StringSelectMenuBuilder()
                    .setCustomId(
                        `store:item:${category.id}`
                    )
                    .setPlaceholder(
                        `Select an item from ${category.name}`
                    )
                    .addOptions(
                        options
                    );

            components.push(
                new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        selector
                    )
            );

            if (
                categoryItems.length >
                MAX_ITEMS_PER_CATEGORY
            ) {
                embed.addFields({
                    name:
                        "More Items",
                    value:
                        `This category contains ${categoryItems.length} items. Only the first ${MAX_ITEMS_PER_CATEGORY} are shown in the selector.`
                });
            }
        }

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    categories.length /
                        CATEGORIES_PER_PAGE
                )
            );

        const navigation =
            new ActionRowBuilder<ButtonBuilder>();

        /*
         * Discord requires every component custom_id
         * in a message to be unique.
         *
         * The old implementation used
         * "store:page:current" for both disabled
         * navigation buttons and the page indicator.
         * That caused Discord error 50035 when the first
         * or last page was rendered.
         *
         * Disabled buttons still need unique custom IDs,
         * so use page-specific IDs for Previous/Next
         * even when they are disabled.
         */
        navigation.addComponents(
            new ButtonBuilder()
                .setCustomId(
                    `store:page:previous:${page}`
                )
                .setLabel(
                    "Previous"
                )
                .setEmoji(
                    "◀️"
                )
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(
                    page <= 0
                ),

            new ButtonBuilder()
                .setCustomId(
                    "store:page:current"
                )
                .setLabel(
                    `Page ${page + 1}/${totalPages}`
                )
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(
                    true
                ),

            new ButtonBuilder()
                .setCustomId(
                    `store:page:next:${page}`
                )
                .setLabel(
                    "Next"
                )
                .setEmoji(
                    "▶️"
                )
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(
                    page >=
                        totalPages - 1
                )
        );

        /*
         * Only add the navigation row when pagination
         * is actually needed.
         *
         * This also leaves the panel cleaner for stores
         * containing four or fewer categories.
         */
        if (
            totalPages > 1
        ) {
            components.push(
                navigation
            );
        }

        return {
            embeds: [
                embed
            ],
            components
        };
    }

    /*
     * =========================
     * ITEM DETAILS
     * =========================
     */

    public async buildItemDetails(
        guildId: string,
        itemId: string
    ) {

        const item =
            await this.store.getItemById(
                guildId,
                itemId
            );

        if (
            !item ||
            !item.enabled
        ) {
            return null;
        }

        const embed =
            new EmbedBuilder()
                .setTitle(
                    `🛍️ ${item.name}`
                )
                .setDescription(
                    item.description
                )
                .setColor(
                    0x1f2a44
                )
                .addFields(
                    {
                        name:
                            "Price",
                        value:
                            `${this.formatNickel(item.price)} Nickel`,
                        inline:
                            true
                    },
                    {
                        name:
                            "Type",
                        value:
                            item.type ===
                                "NATIVE"
                                ? "Native"
                                : "External",
                        inline:
                            true
                    }
                );

        if (
            item.type === "NATIVE"
        ) {
            embed.addFields({
                name:
                    "Stock",
                value:
                    item.stock !== null
                        ? item.stock > 0
                            ? item.stock.toLocaleString(
                                "en-US"
                            )
                            : "Out of stock"
                        : "Unavailable",
                inline:
                    true
            });
        }

        if (
            item.imageUrl
        ) {
            embed.setImage(
                item.imageUrl
            );
        }

        const components:
            ActionRowBuilder<ButtonBuilder>[] = [];

        /*
         * Native items with zero stock cannot
         * currently be purchased.
         */

        const outOfStock =
            item.type === "NATIVE" &&
            (
                item.stock === null ||
                item.stock <= 0
            );

        components.push(
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(
                            `store:purchase:${item.id}`
                        )
                        .setLabel(
                            outOfStock
                                ? "Out of Stock"
                                : "Purchase"
                        )
                        .setEmoji(
                            outOfStock
                                ? "🚫"
                                : "🛒"
                        )
                        .setStyle(
                            outOfStock
                                ? ButtonStyle.Secondary
                                : ButtonStyle.Primary
                        )
                        .setDisabled(
                            outOfStock
                        )
                )
        );

        return {
            embeds: [
                embed
            ],
            components
        };
    }

    /*
     * =========================
     * PURCHASE CONFIRMATION
     * =========================
     */

    public buildPurchaseConfirmation(
        item: StoreItemEntry
    ) {

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "🛒 Confirm Purchase"
                )
                .setDescription(
                    "Please review your purchase before confirming.\n\nYour Nickel will be held when you confirm this purchase."
                )
                .setColor(
                    0x1f2a44
                )
                .addFields(
                    {
                        name:
                            "Item",
                        value:
                            item.name,
                        inline:
                            true
                    },
                    {
                        name:
                            "Price",
                        value:
                            `${this.formatNickel(item.price)} Nickel`,
                        inline:
                            true
                    },
                    {
                        name:
                            "Type",
                        value:
                            item.type === "NATIVE"
                                ? "Native"
                                : "External",
                        inline:
                            true
                    }
                )
                .setTimestamp()
                .setFooter({
                    text:
                        "Quill & Ink • Store"
                });

        if (
            item.type === "NATIVE"
        ) {
            embed.addFields({
                name:
                    "Stock",
                value:
                    item.stock !== null
                        ? item.stock > 0
                            ? item.stock.toLocaleString(
                                "en-US"
                            )
                            : "Out of stock"
                        : "Unavailable",
                inline:
                    true
            });
        }

        if (
            item.description
        ) {
            embed.addFields({
                name:
                    "Description",
                value:
                    this.truncate(
                        item.description,
                        1024
                    )
            });
        }

        if (
            item.imageUrl
        ) {
            embed.setThumbnail(
                item.imageUrl
            );
        }

        const components =
            [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(
                                `store:purchase-confirm:${item.id}`
                            )
                            .setLabel(
                                "Confirm Purchase"
                            )
                            .setEmoji(
                                "✅"
                            )
                            .setStyle(
                                ButtonStyle.Success
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                "store:purchase-cancel"
                            )
                            .setLabel(
                                "Cancel"
                            )
                            .setEmoji(
                                "❌"
                            )
                            .setStyle(
                                ButtonStyle.Secondary
                            )
                    )
            ];

        return {
            embeds: [
                embed
            ],
            components
        };
    }

    /*
     * =========================
     * PURCHASE THREAD MESSAGE
     * =========================
     */

    public buildPurchaseThreadMessage(
        item: StoreItemEntry,
        purchase: StorePurchaseResult
    ) {

        const embed =
            new EmbedBuilder()
                .setTitle(
                    `🛒 Store Purchase`
                )
                .setColor(
                    purchase.status ===
                        "COMPLETED"
                        ? 0x2ecc71
                        : purchase.status ===
                            "CANCELLED"
                            ? 0xe74c3c
                            : purchase.status ===
                                "ACCEPTED"
                                ? 0xf1c40f
                                : 0x3498db
                )
                .setTimestamp()
                .addFields(
                    {
                        name:
                            "Item",
                        value:
                            item.name,
                        inline:
                            true
                    },
                    {
                        name:
                            "Price",
                        value:
                            `${this.formatNickel(purchase.price)} Nickel`,
                        inline:
                            true
                    },
                    {
                        name:
                            "Type",
                        value:
                            item.type ===
                                "NATIVE"
                                ? "Native"
                                : "External",
                        inline:
                            true
                    },
                    {
                        name:
                            "Buyer",
                        value:
                            `<@${purchase.buyerDiscordId}>`,
                        inline:
                            true
                    },
                    {
                        name:
                            "Purchase Status",
                        value:
                            purchase.status,
                        inline:
                            true
                    },
                    {
                        name:
                            "Payment",
                        value:
                            purchase.paymentStatus,
                        inline:
                            true
                    }
                );

        if (
            item.description
        ) {
            embed.setDescription(
                item.description
            );
        }

        if (
            item.imageUrl
        ) {
            embed.setThumbnail(
                item.imageUrl
            );
        }

        const components:
            ActionRowBuilder<ButtonBuilder>[] = [];

        if (
            purchase.status ===
                "PENDING" &&
            purchase.paymentStatus ===
                "HELD"
        ) {
            components.push(
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(
                                `store:accept:${purchase.id}`
                            )
                            .setLabel(
                                "Accept"
                            )
                            .setEmoji(
                                "✅"
                            )
                            .setStyle(
                                ButtonStyle.Success
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                `store:cancel:${purchase.id}`
                            )
                            .setLabel(
                                "Cancel"
                            )
                            .setEmoji(
                                "❌"
                            )
                            .setStyle(
                                ButtonStyle.Danger
                            )
                    )
            );
        }

        if (
            purchase.status ===
                "ACCEPTED" &&
            purchase.paymentStatus ===
                "TRANSFERRED"
        ) {
            components.push(
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(
                                `store:complete:${purchase.id}`
                            )
                            .setLabel(
                                "Complete"
                            )
                            .setEmoji(
                                "📦"
                            )
                            .setStyle(
                                ButtonStyle.Primary
                            )
                    )
            );
        }

        return {
            embeds: [
                embed
            ],
            components
        };
    }

    /*
     * =========================
     * HELPERS
     * =========================
     */

    private getSafePage(
        requestedPage: number,
        categoryCount: number
    ): number {

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    categoryCount /
                        CATEGORIES_PER_PAGE
                )
            );

        return Math.min(
            Math.max(
                requestedPage,
                0
            ),
            totalPages - 1
        );
    }

    private formatNickel(
        amount: bigint
    ): string {

        return amount.toLocaleString(
            "en-US"
        );
    }

    private truncate(
        value: string,
        maxLength: number
    ): string {

        if (
            value.length <=
            maxLength
        ) {
            return value;
        }

        return (
            value.slice(
                0,
                maxLength - 3
            ) +
            "..."
        );
    }
}

END FILE: src/plugins/store/renderers/StoreRenderer.ts
================================================================================

FILE: src/plugins/store/services/StoreService.ts
--------------------------------------------------------------------------------
Original size: 68662 bytes
Exported size: 65929 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import { PrismaService } from "../../../core/database/PrismaService.js";
import { EconomyAccountService } from "../../economy/services/EconomyAccountService.js";
import { Banker } from "../../../global/banking/Banker.js";

const MAX_STORE_STOCK = 2_147_483_647;

export interface StoreItemEntry {
    id: string;
    itemCode: string;
    name: string;
    description: string;
    price: bigint;
    type: string;
    enabled: boolean;
    imageUrl: string | null;
    position: number;
    categoryId: string;
    stock: number | null;
}

export interface StoreConfigEntry {
    id: string;
    guildId: string;
    channelId: string;
    messageId: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface StoreCategoryEntry {
    id: string;
    guildId: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    position: number;
    enabled: boolean;
    storeId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PurchaseValidationResult {
    success: boolean;
    message: string;
    item?: StoreItemEntry;
    purchasesToday?: number;
}

export interface StorePurchaseResult {
    id: string;
    itemId: string;
    buyerDiscordId: string;
    threadId: string | null;
    price: bigint;
    status: string;
    paymentStatus: string;
    paidAt: Date | null;
}

export interface StoreStaffRoleEntry {
    id: string;
    guildId: string;
    roleId: string;
    createdAt: Date;
}

export interface StoreStaffMemberEntry {
    id: string;
    guildId: string;
    discordId: string;
    createdAt: Date;
}

export interface CreateStoreItemOptions {
    itemCode: string;
    name: string;
    description: string;
    price: bigint;
    type: "NATIVE" | "EXTERNAL";
    categoryId: string;
    imageUrl?: string | null;
    stock?: number | null;
}

export interface UpdateStoreItemOptions {
    itemCode?: string;
    name?: string;
    description?: string;
    price?: bigint;
    type?: "NATIVE" | "EXTERNAL";
    categoryId?: string;
    imageUrl?: string | null;
    stock?: number | null;
}

export class StoreService {
    private readonly economy: EconomyAccountService;
    private readonly banker: Banker;

    public constructor(
        private readonly database: PrismaService
    ) {
        this.economy =
            new EconomyAccountService(
                database
            );

        this.banker =
            new Banker(
                database
            );
    }

    /*
     * =========================
     * STORE CONFIGURATION
     * =========================
     */

    public async getStoreConfig(
        guildId: string
    ): Promise<StoreConfigEntry | null> {
        const config =
            await this.database.db.storeConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (!config) {
            return null;
        }

        return {
            id:
                config.id,

            guildId:
                config.guildId,

            channelId:
                config.channelId,

            messageId:
                config.messageId,

            title:
                config.title,

            description:
                config.description,

            imageUrl:
                config.imageUrl,

            createdAt:
                config.createdAt,

            updatedAt:
                config.updatedAt
        };
    }

    public async createStoreConfig(
        guildId: string,
        channelId: string,
        messageId: string
    ): Promise<StoreConfigEntry> {
        const existing =
            await this.database.db.storeConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (existing) {
            throw new Error(
                "STORE_ALREADY_CONFIGURED"
            );
        }

        const config =
            await this.database.db.storeConfig.create({
                data: {
                    guildId,
                    channelId,
                    messageId,
                    title:
                        "Quill Store",
                    description:
                        "Browse the available items below and spend your Nickel on the things your server has to offer."
                }
            });

        return {
            id:
                config.id,

            guildId:
                config.guildId,

            channelId:
                config.channelId,

            messageId:
                config.messageId,

            title:
                config.title,

            description:
                config.description,

            imageUrl:
                config.imageUrl,

            createdAt:
                config.createdAt,

            updatedAt:
                config.updatedAt
        };
    }
        
           public async recoverStore(
        guildId: string,
        channelId: string,
        messageId: string
    ): Promise<StoreConfigEntry> {
        if (!channelId.trim()) {
            throw new Error(
                "STORE_CHANNEL_ID_REQUIRED"
            );
        }

        if (!messageId.trim()) {
            throw new Error(
                "STORE_MESSAGE_ID_REQUIRED"
            );
        }

        const existing =
            await this.database.db.storeConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (!existing) {
            throw new Error(
                "STORE_NOT_CONFIGURED"
            );
        }

        const config =
            await this.database.db.storeConfig.update({
                where: {
                    guildId
                },

                data: {
                    channelId:
                        channelId.trim(),

                    messageId:
                        messageId.trim()
                }
            });

        return {
            id:
                config.id,

            guildId:
                config.guildId,

            channelId:
                config.channelId,

            messageId:
                config.messageId,

            title:
                config.title,

            description:
                config.description,

            imageUrl:
                config.imageUrl,

            createdAt:
                config.createdAt,

            updatedAt:
                config.updatedAt
        };
    }
    
    /*
     * =========================
     * STORE CATEGORIES
     * =========================
     */

    public async getStoreCategories(
        guildId: string
    ): Promise<StoreCategoryEntry[]> {
        const config =
            await this.database.db.storeConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (!config) {
            return [];
        }

        const categories =
            await this.database.db.storeCategory.findMany({
                where: {
                    guildId,
                    storeId:
                        config.id,
                    enabled:
                        true
                },

                orderBy: [
                    {
                        position:
                            "asc"
                    },
                    {
                        name:
                            "asc"
                    }
                ]
            });

        return categories.map(
            (category) => ({
                id:
                    category.id,

                guildId:
                    category.guildId,

                name:
                    category.name,

                description:
                    category.description,

                imageUrl:
                    category.imageUrl,

                position:
                    category.position,

                enabled:
                    category.enabled,

                storeId:
                    category.storeId,

                createdAt:
                    category.createdAt,

                updatedAt:
                    category.updatedAt
            })
        );
    }

    public async getStoreCategoryById(
        guildId: string,
        categoryId: string
    ): Promise<StoreCategoryEntry | null> {
        const category =
            await this.database.db.storeCategory.findFirst({
                where: {
                    id:
                        categoryId,

                    guildId,

                    enabled:
                        true
                }
            });

        if (!category) {
            return null;
        }

        return {
            id:
                category.id,

            guildId:
                category.guildId,

            name:
                category.name,

            description:
                category.description,

            imageUrl:
                category.imageUrl,

            position:
                category.position,

            enabled:
                category.enabled,

            storeId:
                category.storeId,

            createdAt:
                category.createdAt,

            updatedAt:
                category.updatedAt
        };
    }

    public async createStoreCategory(
        guildId: string,
        name: string,
        imageUrl?: string | null
    ): Promise<StoreCategoryEntry> {
        const normalizedName =
            name.trim();

        if (!normalizedName) {
            throw new Error(
                "STORE_CATEGORY_NAME_REQUIRED"
            );
        }

        if (normalizedName.length > 100) {
            throw new Error(
                "STORE_CATEGORY_NAME_TOO_LONG"
            );
        }

        const config =
            await this.database.db.storeConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (!config) {
            throw new Error(
                "STORE_NOT_CONFIGURED"
            );
        }

        const existingCategories =
            await this.database.db.storeCategory.findMany({
                where: {
                    guildId,
                    storeId:
                        config.id,
                    enabled:
                        true
                }
            });

        const duplicate =
            existingCategories.some(
                category =>
                    category.name
                        .trim()
                        .toLowerCase() ===
                    normalizedName
                        .toLowerCase()
            );

        if (duplicate) {
            throw new Error(
                "STORE_CATEGORY_ALREADY_EXISTS"
            );
        }

        let normalizedImageUrl:
            string | null =
            null;

        if (
            imageUrl &&
            imageUrl.trim()
        ) {
            try {
                const parsedUrl =
                    new URL(
                        imageUrl.trim()
                    );

                if (
                    parsedUrl.protocol !==
                        "http:" &&
                    parsedUrl.protocol !==
                        "https:"
                ) {
                    throw new Error();
                }

                normalizedImageUrl =
                    parsedUrl.toString();

            } catch {
                throw new Error(
                    "STORE_CATEGORY_INVALID_IMAGE_URL"
                );
            }
        }

        const highestPosition =
            existingCategories.reduce(
                (
                    highest,
                    category
                ) =>
                    Math.max(
                        highest,
                        category.position
                    ),
                -1
            );

        const category =
            await this.database.db.storeCategory.create({
                data: {
                    guildId,

                    name:
                        normalizedName,

                    imageUrl:
                        normalizedImageUrl,

                    position:
                        highestPosition + 1,

                    enabled:
                        true,

                    storeId:
                        config.id
                }
            });

        return {
            id:
                category.id,

            guildId:
                category.guildId,

            name:
                category.name,

            description:
                category.description,

            imageUrl:
                category.imageUrl,

            position:
                category.position,

            enabled:
                category.enabled,

            storeId:
                category.storeId,

            createdAt:
                category.createdAt,

            updatedAt:
                category.updatedAt
        };
    }

    public async removeStoreCategory(
        guildId: string,
        categoryId: string
    ): Promise<StoreCategoryEntry> {
        const category =
            await this.database.db.storeCategory.findFirst({
                where: {
                    id:
                        categoryId,

                    guildId,

                    enabled:
                        true
                }
            });

        if (!category) {
            throw new Error(
                "STORE_CATEGORY_NOT_FOUND"
            );
        }

        const removedCategory =
            await this.database.db.$transaction(
                async (tx) => {
                    await tx.storeItem.updateMany({
                        where: {
                            guildId,

                            categoryId,

                            enabled:
                                true
                        },

                        data: {
                            enabled:
                                false
                        }
                    });

                    return tx.storeCategory.update({
                        where: {
                            id:
                                category.id
                        },

                        data: {
                            enabled:
                                false
                        }
                    });
                }
            );

        return {
            id:
                removedCategory.id,

            guildId:
                removedCategory.guildId,

            name:
                removedCategory.name,

            description:
                removedCategory.description,

            imageUrl:
                removedCategory.imageUrl,

            position:
                removedCategory.position,

            enabled:
                removedCategory.enabled,

            storeId:
                removedCategory.storeId,

            createdAt:
                removedCategory.createdAt,

            updatedAt:
                removedCategory.updatedAt
        };
    }

    /*
     * =========================
     * STORE ITEMS
     * =========================
     */

    public async getStoreItems(
        guildId: string
    ): Promise<StoreItemEntry[]> {
        const items =
            await this.database.db.storeItem.findMany({
                where: {
                    guildId,
                    enabled:
                        true
                },

                orderBy: [
                    {
                        position:
                            "asc"
                    },
                    {
                        name:
                            "asc"
                    }
                ]
            });

        return items.map(
            item =>
                this.toItemEntry(
                    item
                )
        );
    }

    public async getItem(
        guildId: string,
        itemName: string
    ): Promise<StoreItemEntry | null> {
        const normalizedName =
            itemName
                .trim()
                .toLowerCase();

        if (!normalizedName) {
            return null;
        }

        const items =
            await this.database.db.storeItem.findMany({
                where: {
                    guildId,
                    enabled:
                        true
                }
            });

        const item =
            items.find(
                candidate =>
                    candidate.name
                        .trim()
                        .toLowerCase() ===
                    normalizedName
            );

        if (!item) {
            return null;
        }

        return this.toItemEntry(
            item
        );
    }

    public async getItemById(
        guildId: string,
        itemId: string
    ): Promise<StoreItemEntry | null> {
        const item =
            await this.database.db.storeItem.findFirst({
                where: {
                    id:
                        itemId,

                    guildId,

                    enabled:
                        true
                }
            });

        if (!item) {
            return null;
        }

        return this.toItemEntry(
            item
        );
    }

    public async getItemByCode(
        guildId: string,
        itemCode: string,
        includeDisabled = false
    ): Promise<StoreItemEntry | null> {
        const normalizedCode =
            itemCode
                .trim()
                .toLowerCase();

        if (!normalizedCode) {
            return null;
        }

        const items =
            await this.database.db.storeItem.findMany({
                where: {
                    guildId,
                    ...(includeDisabled
                        ? {}
                        : {
                            enabled:
                                true
                        })
                }
            });

        const item =
            items.find(
                candidate =>
                    candidate.itemCode
                        .trim()
                        .toLowerCase() ===
                    normalizedCode
            );

        if (!item) {
            return null;
        }

        return this.toItemEntry(
            item
        );
    }

    public async createStoreItem(
        guildId: string,
        options: CreateStoreItemOptions
    ): Promise<StoreItemEntry> {
        const itemCode =
            options.itemCode.trim();

        const name =
            options.name.trim();

        const description =
            options.description.trim();

        if (!itemCode) {
            throw new Error(
                "STORE_ITEM_CODE_REQUIRED"
            );
        }

        if (itemCode.length > 50) {
            throw new Error(
                "STORE_ITEM_CODE_TOO_LONG"
            );
        }

        if (!name) {
            throw new Error(
                "STORE_ITEM_NAME_REQUIRED"
            );
        }

        if (name.length > 100) {
            throw new Error(
                "STORE_ITEM_NAME_TOO_LONG"
            );
        }

        if (!description) {
            throw new Error(
                "STORE_ITEM_DESCRIPTION_REQUIRED"
            );
        }

        if (description.length > 1000) {
            throw new Error(
                "STORE_ITEM_DESCRIPTION_TOO_LONG"
            );
        }

        if (options.price <= 0n) {
            throw new Error(
                "STORE_ITEM_INVALID_PRICE"
            );
        }

        if (
            options.type !== "NATIVE" &&
            options.type !== "EXTERNAL"
        ) {
            throw new Error(
                "STORE_ITEM_INVALID_TYPE"
            );
        }

        const stock =
            this.resolveCreateStock(
                options.type,
                options.stock
            );

        const category =
            await this.database.db.storeCategory.findFirst({
                where: {
                    id:
                        options.categoryId,

                    guildId,

                    enabled:
                        true
                }
            });

        if (!category) {
            throw new Error(
                "STORE_ITEM_CATEGORY_NOT_FOUND"
            );
        }

        const existingItems =
            await this.database.db.storeItem.findMany({
                where: {
                    guildId
                }
            });

        const duplicateCode =
            existingItems.some(
                item =>
                    item.itemCode
                        .trim()
                        .toLowerCase() ===
                    itemCode.toLowerCase()
            );

        if (duplicateCode) {
            throw new Error(
                "STORE_ITEM_CODE_ALREADY_EXISTS"
            );
        }

        const normalizedImageUrl =
            this.normalizeItemImageUrl(
                options.imageUrl
            );

        const categoryItems =
            existingItems.filter(
                item =>
                    item.categoryId ===
                    category.id &&
                    item.enabled
            );

        const highestPosition =
            categoryItems.reduce(
                (
                    highest,
                    item
                ) =>
                    Math.max(
                        highest,
                        item.position
                    ),
                -1
            );

        const type =
            options.type === "NATIVE"
                ? "NATIVE"
                : "EXTERNAL";

        const item =
            await this.database.db.storeItem.create({
                data: {
                    guildId,

                    itemCode,

                    name,

                    description,

                    price:
                        options.price,

                    type,

                    enabled:
                        true,

                    imageUrl:
                        normalizedImageUrl,

                    position:
                        highestPosition + 1,

                    categoryId:
                        category.id,

                    stock
                }
            });

        return this.toItemEntry(
            item
        );
    }

    public async updateStoreItem(
        guildId: string,
        currentItemCode: string,
        options: UpdateStoreItemOptions
    ): Promise<StoreItemEntry> {
        const currentCode =
            currentItemCode.trim();

        if (!currentCode) {
            throw new Error(
                "STORE_ITEM_CODE_REQUIRED"
            );
        }

        const existingItems =
            await this.database.db.storeItem.findMany({
                where: {
                    guildId
                }
            });

        const item =
            existingItems.find(
                candidate =>
                    candidate.itemCode
                        .trim()
                        .toLowerCase() ===
                    currentCode.toLowerCase()
            );

        if (!item) {
            throw new Error(
                "STORE_ITEM_NOT_FOUND"
            );
        }

        const data: {
            itemCode?: string;
            name?: string;
            description?: string;
            price?: bigint;
            type?: "NATIVE" | "EXTERNAL";
            categoryId?: string;
            imageUrl?: string | null;
            position?: number;
            stock?: number | null;
        } = {};

        if (
            options.itemCode !==
            undefined
        ) {
            const itemCode =
                options.itemCode.trim();

            if (!itemCode) {
                throw new Error(
                    "STORE_ITEM_CODE_REQUIRED"
                );
            }

            if (itemCode.length > 50) {
                throw new Error(
                    "STORE_ITEM_CODE_TOO_LONG"
                );
            }

            const duplicateCode =
                existingItems.some(
                    candidate =>
                        candidate.id !==
                            item.id &&
                        candidate.itemCode
                            .trim()
                            .toLowerCase() ===
                        itemCode.toLowerCase()
                );

            if (duplicateCode) {
                throw new Error(
                    "STORE_ITEM_CODE_ALREADY_EXISTS"
                );
            }

            data.itemCode =
                itemCode;
        }

        if (
            options.name !==
            undefined
        ) {
            const name =
                options.name.trim();

            if (!name) {
                throw new Error(
                    "STORE_ITEM_NAME_REQUIRED"
                );
            }

            if (name.length > 100) {
                throw new Error(
                    "STORE_ITEM_NAME_TOO_LONG"
                );
            }

            data.name =
                name;
        }

        if (
            options.description !==
            undefined
        ) {
            const description =
                options.description.trim();

            if (!description) {
                throw new Error(
                    "STORE_ITEM_DESCRIPTION_REQUIRED"
                );
            }

            if (description.length > 1000) {
                throw new Error(
                    "STORE_ITEM_DESCRIPTION_TOO_LONG"
                );
            }

            data.description =
                description;
        }

        if (
            options.price !==
            undefined
        ) {
            if (
                options.price <= 0n
            ) {
                throw new Error(
                    "STORE_ITEM_INVALID_PRICE"
                );
            }

            data.price =
                options.price;
        }

        let finalType:
            "NATIVE" | "EXTERNAL" =
            item.type ===
            "NATIVE"
                ? "NATIVE"
                : "EXTERNAL";

        if (
            options.type !==
            undefined
        ) {
            if (
                options.type !==
                    "NATIVE" &&
                options.type !==
                    "EXTERNAL"
            ) {
                throw new Error(
                    "STORE_ITEM_INVALID_TYPE"
                );
            }

            finalType =
                options.type;

            data.type =
                options.type;
        }

        if (
            options.categoryId !==
            undefined
        ) {
            const category =
                await this.database.db.storeCategory.findFirst({
                    where: {
                        id:
                            options.categoryId,

                        guildId,

                        enabled:
                            true
                    }
                });

            if (!category) {
                throw new Error(
                    "STORE_ITEM_CATEGORY_NOT_FOUND"
                );
            }

            data.categoryId =
                category.id;

            if (
                category.id !==
                item.categoryId
            ) {
                const categoryItems =
                    existingItems.filter(
                        candidate =>
                            candidate.categoryId ===
                                category.id &&
                            candidate.enabled &&
                            candidate.id !==
                                item.id
                    );

                const highestPosition =
                    categoryItems.reduce(
                        (
                            highest,
                            candidate
                        ) =>
                            Math.max(
                                highest,
                                candidate.position
                            ),
                        -1
                    );

                data.position =
                    highestPosition + 1;
            }
        }

        if (
            options.imageUrl !==
            undefined
        ) {
            data.imageUrl =
                this.normalizeItemImageUrl(
                    options.imageUrl
                );
        }

        /*
         * =========================
         * STOCK / TYPE INVARIANT
         * =========================
         *
         * Native:
         * - stock must always be a valid integer.
         * - when editing an existing Native item,
         *   omitted stock preserves the current stock.
         * - when converting External -> Native,
         *   stock must be explicitly supplied.
         *
         * External:
         * - stock must always be null.
         * - supplying stock is rejected.
         * - converting Native -> External clears stock.
         */

        if (
            options.stock !==
            undefined
        ) {
            this.validateStockValue(
                options.stock
            );

            if (
                finalType ===
                "EXTERNAL"
            ) {
                throw new Error(
                    "STORE_EXTERNAL_STOCK_NOT_ALLOWED"
                );
            }

            if (
                options.stock ===
                null
            ) {
                throw new Error(
                    "STORE_NATIVE_STOCK_REQUIRED"
                );
            }

            data.stock =
                options.stock;
        } else if (
            finalType ===
            "NATIVE"
        ) {
            if (
                item.type !==
                "NATIVE"
            ) {
                throw new Error(
                    "STORE_NATIVE_STOCK_REQUIRED"
                );
            }

            /*
             * Existing Native item with no
             * stock option: preserve stock.
             *
             * If legacy data somehow has NULL,
             * reject it rather than silently
             * creating an invalid Native item.
             */
            if (
                item.stock ===
                null
            ) {
                throw new Error(
                    "STORE_NATIVE_STOCK_REQUIRED"
                );
            }
        } else {
            /*
             * Every External item must have
             * no local stock.
             */
            data.stock =
                null;
        }

        if (
            Object.keys(data).length ===
            0
        ) {
            throw new Error(
                "STORE_ITEM_NO_CHANGES"
            );
        }

        const updated =
            await this.database.db.storeItem.update({
                where: {
                    id:
                        item.id
                },

                data
            });

        return this.toItemEntry(
            updated
        );
    }

    public async removeStoreItem(
        guildId: string,
        itemCode: string
    ): Promise<StoreItemEntry> {
        const normalizedCode =
            itemCode.trim();

        if (!normalizedCode) {
            throw new Error(
                "STORE_ITEM_CODE_REQUIRED"
            );
        }

        const items =
            await this.database.db.storeItem.findMany({
                where: {
                    guildId,
                    enabled:
                        true
                }
            });

        const item =
            items.find(
                candidate =>
                    candidate.itemCode
                        .trim()
                        .toLowerCase() ===
                    normalizedCode.toLowerCase()
            );

        if (!item) {
            throw new Error(
                "STORE_ITEM_NOT_FOUND"
            );
        }

        const removed =
            await this.database.db.storeItem.update({
                where: {
                    id:
                        item.id
                },

                data: {
                    enabled:
                        false
                }
            });

        return this.toItemEntry(
            removed
        );
    }

    /*
     * =========================
     * PURCHASES TODAY
     * =========================
     */

    public async getPurchasesToday(
        guildId: string,
        discordUserId: string,
        itemId: string
    ): Promise<number> {
        const now =
            new Date();

        const startOfDay =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        const startOfNextDay =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );

        return this.database.db.storePurchase.count({
            where: {
                guildId,

                buyerDiscordId:
                    discordUserId,

                itemId,

                createdAt: {
                    gte:
                        startOfDay,

                    lt:
                        startOfNextDay
                },

                status: {
                    not:
                        "CANCELLED"
                }
            }
        });
    }

    /*
     * =========================
     * VALIDATE PURCHASE
     * =========================
     */

    public async validatePurchase(
        guildId: string,
        discordUserId: string,
        itemId: string
    ): Promise<PurchaseValidationResult> {
        const item =
            await this.getItemById(
                guildId,
                itemId
            );

        if (!item) {
            return {
                success:
                    false,

                message:
                    "That item does not exist or is currently unavailable."
            };
        }

        if (
            item.type ===
                "NATIVE" &&
            (
                item.stock ===
                    null ||
                item.stock <=
                    0
            )
        ) {
            return {
                success:
                    false,

                message:
                    "That item is currently out of stock.",

                item
            };
        }

        const purchasesToday =
            await this.getPurchasesToday(
                guildId,
                discordUserId,
                itemId
            );

        if (
            purchasesToday >= 2
        ) {
            return {
                success:
                    false,

                message:
                    `You have already purchased **${item.name}** twice today. You can purchase it again tomorrow.`,

                item,

                purchasesToday
            };
        }

        return {
            success:
                true,

            message:
                "Purchase is valid.",

            item,

            purchasesToday
        };
    }

    /*
     * =========================
     * CREATE EXTERNAL PURCHASE
     * =========================
     */

    public async createPurchase(
        guildId: string,
        discordUserId: string,
        itemId: string,
        threadId: string
    ): Promise<StorePurchaseResult> {
        if (!threadId) {
            throw new Error(
                "STORE_THREAD_ID_REQUIRED"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {
                const item =
                    await tx.storeItem.findFirst({
                        where: {
                            id:
                                itemId,

                            guildId,

                            enabled:
                                true
                        }
                    });

                if (!item) {
                    throw new Error(
                        "STORE_ITEM_UNAVAILABLE"
                    );
                }

                if (
                    item.type ===
                    "NATIVE"
                ) {
                    throw new Error(
                        "STORE_NATIVE_ITEM_REQUIRED"
                    );
                }

                const now =
                    new Date();

                const startOfDay =
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate()
                    );

                const startOfNextDay =
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() + 1
                    );

                const purchasesToday =
                    await tx.storePurchase.count({
                        where: {
                            guildId,

                            buyerDiscordId:
                                discordUserId,

                            itemId,

                            createdAt: {
                                gte:
                                    startOfDay,

                                lt:
                                    startOfNextDay
                            },

                            status: {
                                not:
                                    "CANCELLED"
                            }
                        }
                    });

                if (
                    purchasesToday >= 2
                ) {
                    throw new Error(
                        "STORE_DAILY_LIMIT_REACHED"
                    );
                }

                await this.economy.holdForStoreInTransaction(
                    tx,
                    guildId,
                    discordUserId,
                    item.price
                );

                const purchase =
                    await tx.storePurchase.create({
                        data: {
                            guildId,

                            itemId,

                            buyerDiscordId:
                                discordUserId,

                            threadId,

                            price:
                                item.price,

                            status:
                                "PENDING",

                            paymentStatus:
                                "HELD",

                            paidAt:
                                now
                        }
                    });

                return this.toPurchaseResult(
                    purchase
                );
            },
            {
                isolationLevel:
                    "Serializable"
            }
        );
    }

    /*
     * =========================
     * CREATE NATIVE PURCHASE
     * =========================
     */

    public async createNativePurchase(
        guildId: string,
        discordUserId: string,
        itemId: string
    ): Promise<StorePurchaseResult> {
        return await this.database.db.$transaction(
            async (tx) => {
                const item =
                    await tx.storeItem.findFirst({
                        where: {
                            id:
                                itemId,

                            guildId,

                            enabled:
                                true
                        }
                    });

                if (!item) {
                    throw new Error(
                        "STORE_ITEM_UNAVAILABLE"
                    );
                }

                if (
                    item.type !==
                    "NATIVE"
                ) {
                    throw new Error(
                        "STORE_NATIVE_ITEM_REQUIRED"
                    );
                }

                const now =
                    new Date();

                const startOfDay =
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate()
                    );

                const startOfNextDay =
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() + 1
                    );

                const purchasesToday =
                    await tx.storePurchase.count({
                        where: {
                            guildId,

                            buyerDiscordId:
                                discordUserId,

                            itemId,

                            createdAt: {
                                gte:
                                    startOfDay,

                                lt:
                                    startOfNextDay
                            },

                            status: {
                                not:
                                    "CANCELLED"
                            }
                        }
                    });

                if (
                    purchasesToday >= 2
                ) {
                    throw new Error(
                        "STORE_DAILY_LIMIT_REACHED"
                    );
                }

                /*
                 * Atomically reserve one copy.
                 *
                 * This prevents two simultaneous
                 * purchases from both buying the
                 * final available copy.
                 */
                const stockUpdate =
                    await tx.storeItem.updateMany({
                        where: {
                            id:
                                item.id,

                            guildId,

                            enabled:
                                true,

                            type:
                                "NATIVE",

                            stock: {
                                gt:
                                    0
                            }
                        },

                        data: {
                            stock: {
                                decrement:
                                    1
                            }
                        }
                    });

                if (
                    stockUpdate.count !==
                    1
                ) {
                    throw new Error(
                        "STORE_OUT_OF_STOCK"
                    );
                }

                /*
                 * Hold the buyer's Nickel.
                 *
                 * If this fails, the entire transaction
                 * rolls back, including the stock decrement.
                 */
                await this.economy.holdForStoreInTransaction(
                    tx,
                    guildId,
                    discordUserId,
                    item.price
                );

                /*
                 * Native purchases have no thread or
                 * staff acceptance stage.
                 */
                const purchase =
                    await tx.storePurchase.create({
                        data: {
                            guildId,

                            itemId,

                            buyerDiscordId:
                                discordUserId,

                            threadId:
                                null,

                            price:
                                item.price,

                            status:
                                "COMPLETED",

                            paymentStatus:
                                "TRANSFERRED",

                            paidAt:
                                now,

                            transferredAt:
                                now,

                            completedAt:
                                now
                        }
                    });

                /*
                 * Move the held Nickel into the
                 * server's InkBank.
                 */
                await this.banker.addToInkBankInTransaction(
                    tx,
                    guildId,
                    item.price
                );

                /*
                 * Deliver the native item immediately.
                 */
                const existingInventoryItem =
                    await tx.inventoryItem.findUnique({
                        where: {
                            guildId_discordUserId_itemId: {
                                guildId,

                                discordUserId,

                                itemId:
                                    item.id
                            }
                        }
                    });

                if (
                    existingInventoryItem
                ) {
                    await tx.inventoryItem.update({
                        where: {
                            id:
                                existingInventoryItem.id
                        },

                        data: {
                            quantity: {
                                increment:
                                    1
                            }
                        }
                    });
                } else {
                    await tx.inventoryItem.create({
                        data: {
                            guildId,

                            discordUserId,

                            itemId:
                                item.id,

                            quantity:
                                1
                        }
                    });
                }

                return this.toPurchaseResult(
                    purchase
                );
            },
            {
                isolationLevel:
                    "Serializable"
            }
        );
    }

    /*
     * =========================
     * ACCEPT PURCHASE
     * =========================
     */

    public async acceptPurchase(
        guildId: string,
        purchaseId: string,
        acceptedBy: string
    ): Promise<StorePurchaseResult> {
        if (!acceptedBy) {
            throw new Error(
                "STORE_ACCEPTED_BY_REQUIRED"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {
                const purchase =
                    await tx.storePurchase.findFirst({
                        where: {
                            id:
                                purchaseId,

                            guildId
                        }
                    });

                if (!purchase) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_FOUND"
                    );
                }

                if (
                    purchase.status ===
                        "ACCEPTED" &&
                    purchase.paymentStatus ===
                        "TRANSFERRED"
                ) {
                    return this.toPurchaseResult(
                        purchase
                    );
                }

                if (
                    purchase.status !==
                        "PENDING" ||
                    purchase.paymentStatus !==
                        "HELD"
                ) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_PENDING"
                    );
                }

                const now =
                    new Date();

                const claimed =
                    await tx.storePurchase.updateMany({
                        where: {
                            id:
                                purchase.id,

                            guildId,

                            status:
                                "PENDING",

                            paymentStatus:
                                "HELD"
                        },

                        data: {
                            status:
                                "ACCEPTED",

                            paymentStatus:
                                "TRANSFERRED",

                            acceptedBy,

                            acceptedAt:
                                now,

                            transferredAt:
                                now
                        }
                    });

                if (
                    claimed.count !==
                    1
                ) {
                    throw new Error(
                        "STORE_PURCHASE_ALREADY_PROCESSED"
                    );
                }

                await this.banker.addToInkBankInTransaction(
                    tx,
                    guildId,
                    purchase.price
                );

                const updated =
                    await tx.storePurchase.findUnique({
                        where: {
                            id:
                                purchase.id
                        }
                    });

                if (!updated) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_FOUND"
                    );
                }

                return this.toPurchaseResult(
                    updated
                );
            }
        );
    }

    /*
     * =========================
     * CANCEL + REFUND
     * =========================
     */

    public async cancelPurchase(
        guildId: string,
        purchaseId: string
    ): Promise<StorePurchaseResult> {
        return await this.database.db.$transaction(
            async (tx) => {
                const purchase =
                    await tx.storePurchase.findFirst({
                        where: {
                            id:
                                purchaseId,
                            guildId
                        }
                    });

                if (!purchase) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_FOUND"
                    );
                }

                if (
                    purchase.paymentStatus ===
                    "REFUNDED"
                ) {
                    return this.toPurchaseResult(
                        purchase
                    );
                }

                if (
                    purchase.paymentStatus ===
                    "TRANSFERRED"
                ) {
                    throw new Error(
                        "STORE_PURCHASE_ALREADY_TRANSFERRED"
                    );
                }

                if (
                    purchase.status !==
                    "PENDING"
                ) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_PENDING"
                    );
                }

                const now =
                    new Date();

                const claimed =
                    await tx.storePurchase.updateMany({
                        where: {
                            id:
                                purchase.id,

                            guildId,

                            status:
                                "PENDING",

                            paymentStatus:
                                "HELD"
                        },

                        data: {
                            status:
                                "CANCELLED",

                            paymentStatus:
                                "REFUNDED",

                            refundedAt:
                                now
                        }
                    });

                if (
                    claimed.count !==
                    1
                ) {
                    throw new Error(
                        "STORE_PURCHASE_ALREADY_PROCESSED"
                    );
                }

                await this.economy.refundStoreInTransaction(
                    tx,
                    guildId,
                    purchase.buyerDiscordId,
                    purchase.price
                );

                const updated =
                    await tx.storePurchase.findUnique({
                        where: {
                            id:
                                purchase.id
                        }
                    });

                if (!updated) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_FOUND"
                    );
                }

                return this.toPurchaseResult(
                    updated
                );
            }
        );
    }

    /*
     * =========================
     * COMPLETE PURCHASE
     * =========================
     */

    public async completePurchase(
        guildId: string,
        purchaseId: string
    ): Promise<StorePurchaseResult> {
        return await this.database.db.$transaction(
            async (tx) => {
                const purchase =
                    await tx.storePurchase.findFirst({
                        where: {
                            id:
                                purchaseId,

                            guildId
                        },

                        include: {
                            item:
                                true
                        }
                    });

                if (!purchase) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_FOUND"
                    );
                }

                if (
                    purchase.status ===
                    "COMPLETED"
                ) {
                    return this.toPurchaseResult(
                        purchase
                    );
                }

                if (
                    purchase.status !==
                        "ACCEPTED" ||
                    purchase.paymentStatus !==
                        "TRANSFERRED"
                ) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_ACCEPTED"
                    );
                }

                const now =
                    new Date();

                const claimed =
                    await tx.storePurchase.updateMany({
                        where: {
                            id:
                                purchase.id,

                            guildId,

                            status:
                                "ACCEPTED",

                            paymentStatus:
                                "TRANSFERRED"
                        },

                        data: {
                            status:
                                "COMPLETED",

                            completedAt:
                                now
                        }
                    });

                if (
                    claimed.count !==
                    1
                ) {
                    throw new Error(
                        "STORE_PURCHASE_ALREADY_PROCESSED"
                    );
                }

                /*
                 * Native purchases normally never reach
                 * this method anymore because they are
                 * completed atomically in createNativePurchase().
                 *
                 * This branch remains for compatibility
                 * with any older native purchases already
                 * sitting in the ACCEPTED state.
                 */
                if (
                    purchase.item.type ===
                    "NATIVE"
                ) {
                    const existingInventoryItem =
                        await tx.inventoryItem.findUnique({
                            where: {
                                guildId_discordUserId_itemId: {
                                    guildId,

                                    discordUserId:
                                        purchase.buyerDiscordId,

                                    itemId:
                                        purchase.itemId
                                }
                            }
                        });

                    if (
                        existingInventoryItem
                    ) {
                        await tx.inventoryItem.update({
                            where: {
                                id:
                                    existingInventoryItem.id
                            },

                            data: {
                                quantity: {
                                    increment:
                                        1
                                }
                            }
                        });
                    } else {
                        await tx.inventoryItem.create({
                            data: {
                                guildId,

                                discordUserId:
                                    purchase.buyerDiscordId,

                                itemId:
                                    purchase.itemId,

                                quantity:
                                    1
                            }
                        });
                    }
                }

                const updated =
                    await tx.storePurchase.findUnique({
                        where: {
                            id:
                                purchase.id
                        }
                    });

                if (!updated) {
                    throw new Error(
                        "STORE_PURCHASE_NOT_FOUND"
                    );
                }

                return this.toPurchaseResult(
                    updated
                );
            }
        );
    }

    /*
     * =========================
     * STORE STAFF
     * =========================
     */

    public async addStaffRole(
        guildId: string,
        roleId: string
    ): Promise<StoreStaffRoleEntry> {
        return this.database.db.storeStaffRole.upsert({
            where: {
                guildId_roleId: {
                    guildId,
                    roleId
                }
            },

            update: {},

            create: {
                guildId,
                roleId
            }
        });
    }

    public async removeStaffRole(
        guildId: string,
        roleId: string
    ): Promise<boolean> {
        const result =
            await this.database.db.storeStaffRole.deleteMany({
                where: {
                    guildId,
                    roleId
                }
            });

        return result.count > 0;
    }

    public async listStaffRoles(
        guildId: string
    ): Promise<StoreStaffRoleEntry[]> {
        return this.database.db.storeStaffRole.findMany({
            where: {
                guildId
            },

            orderBy: {
                createdAt:
                    "asc"
            }
        });
    }

    public async addStaffMember(
        guildId: string,
        discordId: string
    ): Promise<StoreStaffMemberEntry> {
        return this.database.db.storeStaffMember.upsert({
            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            update: {},

            create: {
                guildId,
                discordId
            }
        });
    }

    public async removeStaffMember(
        guildId: string,
        discordId: string
    ): Promise<boolean> {
        const result =
            await this.database.db.storeStaffMember.deleteMany({
                where: {
                    guildId,
                    discordId
                }
            });

        return result.count > 0;
    }

    public async listStaffMembers(
        guildId: string
    ): Promise<StoreStaffMemberEntry[]> {
        return this.database.db.storeStaffMember.findMany({
            where: {
                guildId
            },

            orderBy: {
                createdAt:
                    "asc"
            }
        });
    }

    public async isAuthorizedStaff(
        guildId: string,
        discordId: string,
        roleIds: string[],
        isAdministrator: boolean
    ): Promise<boolean> {
        if (isAdministrator) {
            return true;
        }

        const staffMember =
            await this.database.db.storeStaffMember.findUnique({
                where: {
                    guildId_discordId: {
                        guildId,
                        discordId
                    }
                }
            });

        if (staffMember) {
            return true;
        }

        if (roleIds.length === 0) {
            return false;
        }

        const staffRole =
            await this.database.db.storeStaffRole.findFirst({
                where: {
                    guildId,

                    roleId: {
                        in:
                            roleIds
                    }
                }
            });

        return !!staffRole;
    }

    /*
     * =========================
     * PRIVATE HELPERS
     * =========================
     */

    private validateStockValue(
        stock: number | null
    ): void {
        if (
            stock ===
            null
        ) {
            return;
        }

        if (
            !Number.isInteger(
                stock
            ) ||
            stock < 0
        ) {
            throw new Error(
                "STORE_ITEM_INVALID_STOCK"
            );
        }

        if (
            stock >
            MAX_STORE_STOCK
        ) {
            throw new Error(
                "STORE_STOCK_TOO_HIGH"
            );
        }
    }

    private resolveCreateStock(
        type: "NATIVE" | "EXTERNAL",
        stock: number | null | undefined
    ): number | null {
        if (
            type ===
            "EXTERNAL"
        ) {
            if (
                stock !==
                    undefined &&
                stock !==
                    null
            ) {
                this.validateStockValue(
                    stock
                );

                throw new Error(
                    "STORE_EXTERNAL_STOCK_NOT_ALLOWED"
                );
            }

            return null;
        }

        if (
            stock ===
                undefined ||
            stock ===
                null
        ) {
            throw new Error(
                "STORE_NATIVE_STOCK_REQUIRED"
            );
        }

        this.validateStockValue(
            stock
        );

        return stock;
    }

    private normalizeItemImageUrl(
        imageUrl?: string | null
    ): string | null {
        if (
            !imageUrl ||
            !imageUrl.trim()
        ) {
            return null;
        }

        try {
            const parsedUrl =
                new URL(
                    imageUrl.trim()
                );

            if (
                parsedUrl.protocol !==
                    "http:" &&
                parsedUrl.protocol !==
                    "https:"
            ) {
                throw new Error();
            }

            return parsedUrl.toString();

        } catch {
            throw new Error(
                "STORE_ITEM_INVALID_IMAGE_URL"
            );
        }
    }

    private toItemEntry(
        item: {
            id: string;
            itemCode: string;
            name: string;
            description: string;
            price: bigint;
            type: string;
            enabled: boolean;
            imageUrl: string | null;
            position: number;
            categoryId: string;
            stock: number | null;
        }
    ): StoreItemEntry {
        return {
            id:
                item.id,

            itemCode:
                item.itemCode,

            name:
                item.name,

            description:
                item.description,

            price:
                item.price,

            type:
                item.type,

            enabled:
                item.enabled,

            imageUrl:
                item.imageUrl,

            position:
                item.position,

            categoryId:
                item.categoryId,

            stock:
                item.stock
        };
    }

    private toPurchaseResult(
        purchase: {
            id: string;
            itemId: string;
            buyerDiscordId: string;
            threadId: string | null;
            price: bigint;
            status: string;
            paymentStatus: string;
            paidAt: Date | null;
        }
    ): StorePurchaseResult {
        return {
            id:
                purchase.id,

            itemId:
                purchase.itemId,

            buyerDiscordId:
                purchase.buyerDiscordId,

            threadId:
                purchase.threadId,

            price:
                purchase.price,

            status:
                purchase.status,

            paymentStatus:
                purchase.paymentStatus,

            paidAt:
                purchase.paidAt
        };
    }
}


END FILE: src/plugins/store/services/StoreService.ts
================================================================================

FILE: src/plugins/store/StorePlugin.ts
--------------------------------------------------------------------------------
Original size: 36717 bytes
Exported size: 35164 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ButtonInteraction,
    ChannelType,
    Interaction,
    PermissionsBitField,
    StringSelectMenuInteraction,
    TextChannel,
    ThreadAutoArchiveDuration,
    ThreadChannel
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";
import { BotClient } from "../../core/client/BotClient.js";

import { StoreCommand } from "./commands/StoreCommand.js";
import { StoreRenderer } from "./renderers/StoreRenderer.js";
import {
    StorePurchaseResult,
    StoreService
} from "./services/StoreService.js";

export class StorePlugin implements Plugin {

    readonly metadata = {
        id:
            "store",

        name:
            "Store",

        version:
            "1.0.0",

        description:
            "Server stores with Nickel purchases and configurable Store staff."
    };

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Store] Registering plugin..."
        );

        context.commands.registerCommand(
            StoreCommand
        );

        context.on(
            "interactionCreate",
            async (
                interaction: Interaction
            ): Promise<void> => {

                try {
                    await this.handleInteraction(
                        context,
                        interaction
                    );

                } catch (error) {

                    context.logger.error(
                        `[Store] Interaction error: ${String(error)}`
                    );

                    await this.handleInteractionError(
                        interaction
                    );
                }
            }
        );

        context.logger.info(
            "[Store] Plugin registered."
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Store] Plugin loaded."
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Store] Plugin unloaded."
        );
    }

    /*
     * =========================
     * INTERACTION HANDLER
     * =========================
     */

    private async handleInteraction(
        context: PluginContext,
        interaction: Interaction
    ): Promise<void> {

        if (
            !interaction.guild
        ) {
            return;
        }

        if (
            !interaction.isButton() &&
            !interaction.isStringSelectMenu()
        ) {
            return;
        }

        if (
            !interaction.customId.startsWith(
                "store:"
            )
        ) {
            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            context.logger.error(
                "[Store] Database service is unavailable."
            );

            return;
        }

        const client =
            interaction.client as BotClient;

        const renderer =
            new StoreRenderer(
                client,
                database
            );

        const store =
            new StoreService(
                database
            );

        /*
         * =========================
         * CATEGORY PAGE
         * =========================
         */

        if (
            interaction.isButton() &&
            interaction.customId.startsWith(
                "store:page:"
            )
        ) {

            const pageValue =
                interaction.customId.substring(
                    "store:page:".length
                );

            /*
             * The current-page button is disabled
             * and intentionally non-interactive.
             */

            if (
                pageValue ===
                "current"
            ) {
                return;
            }

            let currentPage: number;
            let targetPage: number;

            if (
                pageValue.startsWith(
                    "previous:"
                )
            ) {

                currentPage =
                    Number.parseInt(
                        pageValue.substring(
                            "previous:".length
                        ),
                        10
                    );

                if (
                    !Number.isInteger(
                        currentPage
                    ) ||
                    currentPage <= 0
                ) {
                    return;
                }

                targetPage =
                    currentPage - 1;

            } else if (
                pageValue.startsWith(
                    "next:"
                )
            ) {

                currentPage =
                    Number.parseInt(
                        pageValue.substring(
                            "next:".length
                        ),
                        10
                    );

                if (
                    !Number.isInteger(
                        currentPage
                    ) ||
                    currentPage < 0
                ) {
                    return;
                }

                targetPage =
                    currentPage + 1;

            } else {

                /*
                 * Reject unknown Store pagination IDs.
                 */

                return;
            }

            await interaction.deferUpdate();

            await renderer.refreshStorePanel(
                interaction.guild.id,
                targetPage
            );

            return;
        }

        /*
         * =========================
         * ITEM SELECTION
         * =========================
         */

        if (
            interaction.isStringSelectMenu() &&
            interaction.customId.startsWith(
                "store:item:"
            )
        ) {

            await this.handleItemSelection(
                interaction,
                renderer
            );

            return;
        }

        /*
         * =========================
         * PURCHASE DETAILS
         * =========================
         *
         * The Purchase button only opens
         * the confirmation screen.
         */

        if (
            interaction.isButton() &&
            interaction.customId.startsWith(
                "store:purchase:"
            )
        ) {

            await this.handlePurchase(
                interaction,
                store,
                renderer
            );

            return;
        }

        /*
         * =========================
         * PURCHASE CONFIRMATION
         * =========================
         */

        if (
            interaction.isButton() &&
            interaction.customId.startsWith(
                "store:purchase-confirm:"
            )
        ) {

            await this.handlePurchaseConfirmation(
                interaction,
                store,
                renderer,
                context
            );

            return;
        }

        /*
         * =========================
         * PURCHASE CANCELLATION
         * =========================
         */

        if (
            interaction.isButton() &&
            interaction.customId ===
                "store:purchase-cancel"
        ) {

            await this.handlePurchaseCancellation(
                interaction
            );

            return;
        }

        /*
         * =========================
         * ACCEPT
         * =========================
         */

        if (
            interaction.isButton() &&
            interaction.customId.startsWith(
                "store:accept:"
            )
        ) {

            await this.handleAccept(
                interaction,
                store,
                renderer,
                context
            );

            return;
        }

        /*
         * =========================
         * CANCEL
         * =========================
         */

        if (
            interaction.isButton() &&
            interaction.customId.startsWith(
                "store:cancel:"
            )
        ) {

            await this.handleCancel(
                interaction,
                store,
                renderer,
                context
            );

            return;
        }

        /*
         * =========================
         * COMPLETE
         * =========================
         */

        if (
            interaction.isButton() &&
            interaction.customId.startsWith(
                "store:complete:"
            )
        ) {

            await this.handleComplete(
                interaction,
                store,
                renderer,
                context
            );

            return;
        }
    }

    /*
     * =========================
     * ITEM SELECTION
     * =========================
     */

    private async handleItemSelection(
        interaction: StringSelectMenuInteraction,
        renderer: StoreRenderer
    ): Promise<void> {

        const itemId =
            interaction.values[0];

        if (
            !itemId ||
            itemId ===
                "empty"
        ) {

            await interaction.reply({
                content:
                    "📭 There are currently no items available in this category.",

                flags:
                    64
            });

            return;
        }

        const details =
            await renderer.buildItemDetails(
                interaction.guild!.id,
                itemId
            );

        if (!details) {

            await interaction.reply({
                content:
                    "❌ That item is no longer available.",

                flags:
                    64
            });

            return;
        }

        await interaction.reply({
            embeds:
                details.embeds,

            components:
                details.components,

            flags:
                64
        });
    }

    /*
     * =========================
     * PURCHASE
     * =========================
     *
     * This handler only validates that the
     * item still exists and displays the
     * confirmation screen.
     */

    private async handlePurchase(
        interaction: ButtonInteraction,
        store: StoreService,
        renderer: StoreRenderer
    ): Promise<void> {

        const guild =
            interaction.guild;

        if (!guild) {
            return;
        }

        const itemId =
            interaction.customId.substring(
                "store:purchase:".length
            );

        if (!itemId) {

            await interaction.reply({
                content:
                    "❌ That store item could not be identified.",

                flags:
                    64
            });

            return;
        }

        const item =
            await store.getItemById(
                guild.id,
                itemId
            );

        if (
            !item ||
            !item.enabled
        ) {

            await interaction.reply({
                content:
                    "❌ That item is no longer available.",

                flags:
                    64
            });

            return;
        }

        const confirmation =
            renderer.buildPurchaseConfirmation(
                item
            );

        await interaction.reply({
            embeds:
                confirmation.embeds,

            components:
                confirmation.components,

            flags:
                64
        });
    }

    /*
     * =========================
     * PURCHASE CONFIRMATION
     * =========================
     *
     * Native and External purchases
     * intentionally split here.
     *
     * NATIVE:
     *   StoreService handles the complete
     *   atomic purchase transaction.
     *
     * EXTERNAL:
     *   A private thread is created first,
     *   then StoreService holds Nickel and
     *   creates the pending purchase.
     */

    private async handlePurchaseConfirmation(
        interaction: ButtonInteraction,
        store: StoreService,
        renderer: StoreRenderer,
        context: PluginContext
    ): Promise<void> {

        const guild =
            interaction.guild;

        if (!guild) {
            return;
        }

        const itemId =
            interaction.customId.substring(
                "store:purchase-confirm:".length
            );

        if (!itemId) {

            await interaction.reply({
                content:
                    "❌ That store item could not be identified.",

                flags:
                    64
            });

            return;
        }

        await interaction.deferUpdate();

        const validation =
            await store.validatePurchase(
                guild.id,
                interaction.user.id,
                itemId
            );

        if (
            !validation.success ||
            !validation.item
        ) {

            await interaction.editReply({
                content:
                    `❌ ${validation.message}`,

                embeds: [],
                components: []
            });

            return;
        }

        /*
         * =========================
         * NATIVE PURCHASE
         * =========================
         *
         * No Store channel or thread is
         * involved.
         *
         * The StoreService method will be
         * responsible for the atomic stock,
         * Nickel and inventory transaction.
         */

        if (
            validation.item.type ===
            "NATIVE"
        ) {

            try {

                const purchase =
                    await store.createNativePurchase(
                        guild.id,
                        interaction.user.id,
                        itemId
                    );

                await interaction.editReply({
                    content:
                        `✅ You purchased **${validation.item.name}** for **${purchase.price.toLocaleString()} Nickel**.`,

                    embeds: [],
                    components: []
                });

            } catch (error) {

                context.logger.error(
                    `[Store] Native purchase creation failed: ${String(error)}`
                );

                await interaction.editReply({
                    content:
                        this.getPurchaseErrorMessage(
                            error
                        ),

                    embeds: [],
                    components: []
                });
            }

            return;
        }

        /*
         * =========================
         * EXTERNAL PURCHASE
         * =========================
         */

        const config =
            await store.getStoreConfig(
                guild.id
            );

        if (!config) {

            await interaction.editReply({
                content:
                    "❌ The Store has not been configured correctly.",

                embeds: [],
                components: []
            });

            return;
        }

        const channel =
            await interaction.client.channels.fetch(
                config.channelId
            );

        if (
            !channel ||
            !(channel instanceof TextChannel)
        ) {

            await interaction.editReply({
                content:
                    "❌ The configured Store channel could not be found.",

                embeds: [],
                components: []
            });

            return;
        }

        let thread:
            ThreadChannel | null =
            null;

        let purchase:
            StorePurchaseResult | null =
            null;

        try {

            thread =
                await channel.threads.create({
                    name:
                        this.buildPurchaseThreadName(
                            interaction.user.id,
                            validation.item.itemCode
                        ),

                    type:
                        ChannelType.PrivateThread,

                    autoArchiveDuration:
                        ThreadAutoArchiveDuration.OneDay,

                    reason:
                        `Store purchase created by ${interaction.user.id}`
                });

            /*
             * Buyer must always be able to access
             * their purchase thread.
             */

            await thread.members.add(
                interaction.user.id
            );

            /*
             * Load configured Store staff.
             */

            const staffMembers =
                await store.listStaffMembers(
                    guild.id
                );

            const staffRoles =
                await store.listStaffRoles(
                    guild.id
                );

            const staffMemberIds =
                new Set<string>();

            for (
                const staffMember
                of staffMembers
            ) {

                staffMemberIds.add(
                    staffMember.discordId
                );
            }

            /*
             * Resolve members belonging to
             * configured staff roles.
             */

            if (
                staffRoles.length > 0
            ) {

                const members =
                    await guild.members.fetch();

                const configuredRoleIds =
                    new Set(
                        staffRoles.map(
                            role =>
                                role.roleId
                        )
                    );

                for (
                    const member
                    of members.values()
                ) {

                    const hasStaffRole =
                        member.roles.cache.some(
                            role =>
                                configuredRoleIds.has(
                                    role.id
                                )
                        );

                    if (
                        hasStaffRole
                    ) {

                        staffMemberIds.add(
                            member.id
                        );
                    }
                }
            }

            /*
             * Add configured staff members.
             */

            for (
                const staffId
                of staffMemberIds
            ) {

                if (
                    staffId ===
                    interaction.user.id
                ) {
                    continue;
                }

                try {

                    await thread.members.add(
                        staffId
                    );

                } catch (error) {

                    context.logger.warn(
                        `[Store] Could not add staff member ${staffId} to purchase thread: ${String(error)}`
                    );
                }
            }

            /*
             * Create the actual external purchase
             * only after the private thread exists.
             *
             * StoreService performs the Nickel hold
             * atomically with purchase creation.
             */

            purchase =
                await store.createPurchase(
                    guild.id,
                    interaction.user.id,
                    itemId,
                    thread.id
                );

            const staffRoleMentions =
                staffRoles.map(
                    role =>
                        `<@&${role.roleId}>`
                );

            const mentionParts = [
                `<@${interaction.user.id}>`,
                ...staffRoleMentions
            ];

            const threadMessage =
                renderer.buildPurchaseThreadMessage(
                    validation.item,
                    purchase
                );

            await thread.send({
                content:
                    mentionParts.join(
                        " "
                    ),

                embeds:
                    threadMessage.embeds,

                components:
                    threadMessage.components,

                allowedMentions: {
                    users: [
                        interaction.user.id
                    ],

                    roles:
                        staffRoles.map(
                            role =>
                                role.roleId
                        )
                }
            });

            await interaction.editReply({
                content:
                    `✅ Your purchase thread has been created: <#${thread.id}>`,

                embeds: [],
                components: []
            });

        } catch (error) {

            /*
             * If the purchase was already created,
             * cancel it through StoreService so the
             * held Nickel is refunded before cleanup.
             */

            if (
                purchase
            ) {

                try {

                    await store.cancelPurchase(
                        guild.id,
                        purchase.id
                    );

                } catch (cancelError) {

                    context.logger.error(
                        `[Store] Failed to refund purchase ${purchase.id} during thread cleanup: ${String(cancelError)}`
                    );
                }
            }

            if (
                thread
            ) {

                try {

                    await thread.delete(
                        "Store purchase creation failed"
                    );

                } catch (deleteError) {

                    context.logger.error(
                        `[Store] Failed to delete failed purchase thread ${thread.id}: ${String(deleteError)}`
                    );
                }
            }

            context.logger.error(
                `[Store] External purchase creation failed: ${String(error)}`
            );

            await interaction.editReply({
                content:
                    this.getPurchaseErrorMessage(
                        error
                    ),

                embeds: [],
                components: []
            });
        }
    }

    /*
     * =========================
     * PURCHASE CANCELLATION
     * =========================
     */

    private async handlePurchaseCancellation(
        interaction: ButtonInteraction
    ): Promise<void> {

        await interaction.update({
            content:
                "Purchase cancelled.",

            embeds: [],
            components: []
        });
    }

    /*
     * =========================
     * ACCEPT
     * =========================
     */

    private async handleAccept(
        interaction: ButtonInteraction,
        store: StoreService,
        renderer: StoreRenderer,
        context: PluginContext
    ): Promise<void> {

        const purchaseId =
            interaction.customId.substring(
                "store:accept:".length
            );

        if (!purchaseId) {
            return;
        }

        const authorized =
            await this.isStaffAuthorized(
                interaction,
                store
            );

        if (!authorized) {

            await interaction.reply({
                content:
                    "🔒 You are not authorized to manage Store purchases.",

                flags:
                    64
            });

            return;
        }

        await interaction.deferUpdate();

        try {

            const purchase =
                await store.acceptPurchase(
                    interaction.guild!.id,
                    purchaseId,
                    interaction.user.id
                );

            await this.updatePurchaseMessage(
                interaction,
                purchase,
                renderer
            );

        } catch (error) {

            context.logger.error(
                `[Store] Failed to accept purchase ${purchaseId}: ${String(error)}`
            );

            await this.sendFollowUpError(
                interaction,
                this.getPurchaseActionErrorMessage(
                    error
                )
            );
        }
    }

    /*
     * =========================
     * CANCEL
     * =========================
     */

    private async handleCancel(
        interaction: ButtonInteraction,
        store: StoreService,
        renderer: StoreRenderer,
        context: PluginContext
    ): Promise<void> {

        const purchaseId =
            interaction.customId.substring(
                "store:cancel:".length
            );

        if (!purchaseId) {
            return;
        }

        const authorized =
            await this.isStaffAuthorized(
                interaction,
                store
            );

        if (!authorized) {

            await interaction.reply({
                content:
                    "🔒 You are not authorized to manage Store purchases.",

                flags:
                    64
            });

            return;
        }

        await interaction.deferUpdate();

        try {

            const purchase =
                await store.cancelPurchase(
                    interaction.guild!.id,
                    purchaseId
                );

            await this.updatePurchaseMessage(
                interaction,
                purchase,
                renderer
            );

        } catch (error) {

            context.logger.error(
                `[Store] Failed to cancel purchase ${purchaseId}: ${String(error)}`
            );

            await this.sendFollowUpError(
                interaction,
                this.getPurchaseActionErrorMessage(
                    error
                )
            );
        }
    }

    /*
     * =========================
     * COMPLETE
     * =========================
     */

    private async handleComplete(
        interaction: ButtonInteraction,
        store: StoreService,
        renderer: StoreRenderer,
        context: PluginContext
    ): Promise<void> {

        const purchaseId =
            interaction.customId.substring(
                "store:complete:".length
            );

        if (!purchaseId) {
            return;
        }

        const authorized =
            await this.isStaffAuthorized(
                interaction,
                store
            );

        if (!authorized) {

            await interaction.reply({
                content:
                    "🔒 You are not authorized to manage Store purchases.",

                flags:
                    64
            });

            return;
        }

        await interaction.deferUpdate();

        try {

            const purchase =
                await store.completePurchase(
                    interaction.guild!.id,
                    purchaseId
                );

            await this.updatePurchaseMessage(
                interaction,
                purchase,
                renderer
            );

        } catch (error) {

            context.logger.error(
                `[Store] Failed to complete purchase ${purchaseId}: ${String(error)}`
            );

            await this.sendFollowUpError(
                interaction,
                this.getPurchaseActionErrorMessage(
                    error
                )
            );
        }
    }

    /*
     * =========================
     * STAFF AUTHORIZATION
     * =========================
     */

    private async isStaffAuthorized(
        interaction: ButtonInteraction,
        store: StoreService
    ): Promise<boolean> {

        const guild =
            interaction.guild;

        if (!guild) {
            return false;
        }

        const member =
            interaction.member;

        const roleIds: string[] = [];

        if (
            member &&
            typeof member !== "string"
        ) {

            if (
                Array.isArray(
                    member.roles
                )
            ) {

                roleIds.push(
                    ...member.roles
                );

            } else {

                roleIds.push(
                    ...Array.from(
                        member.roles.cache.keys()
                    )
                );
            }
        }

        const isAdministrator =
            interaction.memberPermissions?.has(
                PermissionsBitField.Flags.Administrator
            ) ??
            false;

        return store.isAuthorizedStaff(
            guild.id,
            interaction.user.id,
            roleIds,
            isAdministrator
        );
    }

    /*
     * =========================
     * UPDATE PURCHASE MESSAGE
     * =========================
     */

    private async updatePurchaseMessage(
        interaction: ButtonInteraction,
        purchase: StorePurchaseResult,
        renderer: StoreRenderer
    ): Promise<void> {

        const item =
            await this.getItemForPurchase(
                interaction,
                purchase
            );

        if (!item) {

            await interaction.message.edit({
                content:
                    "⚠️ The purchase was updated, but the original store item could not be loaded.",

                components: []
            });

            return;
        }

        const message =
            renderer.buildPurchaseThreadMessage(
                item,
                purchase
            );

        await interaction.message.edit({
            embeds:
                message.embeds,

            components:
                message.components
        });
    }

    private async getItemForPurchase(
        interaction: ButtonInteraction,
        purchase: StorePurchaseResult
    ) {

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            return null;
        }

        const store =
            new StoreService(
                database
            );

        return store.getItemById(
            interaction.guild!.id,
            purchase.itemId
        );
    }

    /*
     * =========================
     * ERROR HANDLING
     * =========================
     */

    private async handleInteractionError(
        interaction: Interaction
    ): Promise<void> {

        if (
            !interaction.isRepliable()
        ) {
            return;
        }

        const message =
            "❌ Something went wrong while processing that Store action.";

        try {

            if (
                interaction.deferred
            ) {

                await interaction.editReply({
                    content:
                        message
                });

            } else if (
                !interaction.replied
            ) {

                await interaction.reply({
                    content:
                        message,

                    flags:
                        64
                });
            }

        } catch {
            /*
             * The interaction may already have
             * expired or been acknowledged.
             */
        }
    }

    private async sendFollowUpError(
        interaction: ButtonInteraction,
        message: string
    ): Promise<void> {

        try {

            await interaction.followUp({
                content:
                    message,

                flags:
                    64
            });

        } catch {
            /*
             * Ignore follow-up failures after
             * the original interaction has been
             * acknowledged.
             */
        }
    }

    /*
     * =========================
     * PURCHASE ERRORS
     * =========================
     */

    private getPurchaseErrorMessage(
        error: unknown
    ): string {

        if (
            error instanceof Error
        ) {

            switch (
                error.message
            ) {

                case "STORE_DAILY_LIMIT_REACHED":
                    return "❌ You have already purchased this item twice today.";

                case "STORE_ITEM_UNAVAILABLE":
                    return "❌ That item is no longer available.";

                case "STORE_INSUFFICIENT_FUNDS":
                    return "❌ You do not have enough Nickel for this purchase.";

                case "STORE_OUT_OF_STOCK":
                    return "❌ That item is currently out of stock.";

                case "STORE_NATIVE_ITEM_REQUIRED":
                    return "❌ That item cannot be purchased through the native Store system.";

                case "STORE_THREAD_ID_REQUIRED":
                    return "❌ The purchase thread could not be created correctly.";

                default:
                    break;
            }
        }

        return "❌ The purchase could not be created. Your Nickel was not kept if the purchase transaction failed.";
    }

    private getPurchaseActionErrorMessage(
        error: unknown
    ): string {

        if (
            error instanceof Error
        ) {

            switch (
                error.message
            ) {

                case "STORE_PURCHASE_NOT_FOUND":
                    return "❌ That purchase could not be found.";

                case "STORE_PURCHASE_NOT_PENDING":
                    return "⚠️ That purchase is no longer pending.";

                case "STORE_PURCHASE_ALREADY_PROCESSED":
                    return "⚠️ That purchase was already processed by someone else.";

                case "STORE_PURCHASE_ALREADY_TRANSFERRED":
                    return "⚠️ That purchase has already been transferred and cannot be cancelled.";

                case "STORE_PURCHASE_NOT_ACCEPTED":
                    return "⚠️ That purchase has not been accepted yet.";

                default:
                    break;
            }
        }

        return "❌ The Store purchase could not be updated.";
    }

    /*
     * =========================
     * THREAD NAME
     * =========================
     */

    private buildPurchaseThreadName(
        discordUserId: string,
        itemCode: string
    ): string {

        const base =
            `purchase-${discordUserId}-${itemCode}`;

        if (
            base.length <= 100
        ) {
            return base;
        }

        return base.slice(
            0,
            100
        );
    }
}

END FILE: src/plugins/store/StorePlugin.ts
================================================================================

EXCLUDED AND SKIPPED FILES
================================================================================
These files were not included in the source sections above.
- None.

KNOWLEDGE EXTRACTION GUIDANCE
================================================================================
- Use file paths as source references.
- Distinguish explicit code behavior from inferred behavior.
- Do not claim a command is registered solely because its source file exists.
- Trace handlers, services, configuration, and database calls before describing complete behavior.
- Distinguish implemented functionality from comments, plans, tests, and documentation.
- If evidence is incomplete or contradictory, state that uncertainty.
- Never infer live guild settings, database records, or current bot uptime from source code alone.
- This export may contain proprietary implementation details. Review it before sharing.

END OF TRacebook PROJECT KNOWLEDGE EXPORT
