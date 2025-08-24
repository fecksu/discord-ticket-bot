import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from "discord.js";
import config from "../config.json" assert { type: "json" };
import { saveTranscript } from "../utils/transcript.js";

export const name = "interactionCreate";

export async function execute(interaction, client) {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd) await cmd.execute(interaction, client);
  }

  if (interaction.isStringSelectMenu() && interaction.customId === "ticket-category") {
    const category = interaction.values[0];

    const modal = new ModalBuilder()
      .setCustomId(`modal-${category}`)
      .setTitle("Formulir Tiket");

    const input = new TextInputBuilder()
      .setCustomId("alasan")
      .setLabel("Jelaskan permasalahan Anda")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit()) {
    const category = interaction.customId.split("-")[1];
    const reason = interaction.fields.getTextInputValue("alasan");

    const guild = interaction.guild;
    const categoryId = config.categories[category] || config.manageCategoryId;

    // cek tiket aktif
    const existing = guild.channels.cache.find(ch => ch.topic === interaction.user.id);
    if (existing) return interaction.reply({ content: "❌ Anda sudah memiliki tiket aktif.", ephemeral: true });

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: interaction.user.id,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: config.staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle(`🎫 Tiket ${interaction.user.username}`)
      .setDescription(`Kategori: **${category}**\nAlasan: ${reason}`)
      .setColor("Green");

    await channel.send({ content: `<@&${config.staffRoleId}> tiket baru dibuat oleh ${interaction.user}`, embeds: [embed] });
    await interaction.reply({ content: `✅ Tiket berhasil dibuat: ${channel}`, ephemeral: true });
  }
}
