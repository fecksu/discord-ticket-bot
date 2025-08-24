import {
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  PermissionsBitField
} from "discord.js";
import config from "../config.json" assert { type: "json" };
import { ticketEmbed } from "../utils/embeds.js";

const activeTickets = new Map();

export const name = "interactionCreate";
export const once = false;

export async function execute(interaction, client) {
  // ==========================
  // 1. HANDLE SELECT MENU
  // ==========================
  if (interaction.isStringSelectMenu() && interaction.customId === "ticket-category") {
    const category = interaction.values[0];
    if (activeTickets.has(interaction.user.id)) {
      return interaction.reply({ content: "❌ Kamu masih punya tiket aktif!", ephemeral: true });
    }

    let modal;
    if (category === "reportPlayer") {
      modal = new ModalBuilder()
        .setCustomId("modal-report-player")
        .setTitle("Report Player")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("ucp_pelapor").setLabel("UCP Pelapor").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("ucp_terlapor").setLabel("UCP Terlapor").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("jenis_pelanggaran").setLabel("Jenis Pelanggaran").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("waktu").setLabel("Waktu Kejadian").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("kronologis").setLabel("Kronologis").setStyle(TextInputStyle.Paragraph).setRequired(true)
          )
        );
    }

    if (category === "reportStaff") {
      modal = new ModalBuilder()
        .setCustomId("modal-report-staff")
        .setTitle("Report Staff")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("ucp_pelapor").setLabel("UCP Pelapor").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("staff_terlapor").setLabel("Staff Terlapor").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("jenis_pelanggaran").setLabel("Jenis Pelanggaran").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("waktu").setLabel("Waktu Kejadian").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("kronologis").setLabel("Kronologis").setStyle(TextInputStyle.Paragraph).setRequired(true)
          )
        );
    }

    if (category === "requestDonasi") {
      modal = new ModalBuilder()
        .setCustomId("modal-donasi")
        .setTitle("Request Donasi")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("ucp").setLabel("Nama UCP").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("karakter").setLabel("Nama Karakter").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("jenis_donasi").setLabel("Jenis Donasi").setStyle(TextInputStyle.Short).setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder().setCustomId("pembayaran").setLabel("Pembayaran Via").setStyle(TextInputStyle.Short).setRequired(true)
          )
        );
    }

    return interaction.showModal(modal);
  }

  // ==========================
  // 2. HANDLE MODAL SUBMIT
  // ==========================
  if (interaction.isModalSubmit()) {
    let kategori, responses = {};

    if (interaction.customId === "modal-report-player") {
      kategori = "Report Player";
      responses = {
        "UCP Pelapor": interaction.fields.getTextInputValue("ucp_pelapor"),
        "UCP Terlapor": interaction.fields.getTextInputValue("ucp_terlapor"),
        "Jenis Pelanggaran": interaction.fields.getTextInputValue("jenis_pelanggaran"),
        "Waktu Kejadian": interaction.fields.getTextInputValue("waktu"),
        "Kronologis": interaction.fields.getTextInputValue("kronologis")
      };
    }

    if (interaction.customId === "modal-report-staff") {
      kategori = "Report Staff";
      responses = {
        "UCP Pelapor": interaction.fields.getTextInputValue("ucp_pelapor"),
        "Staff Terlapor": interaction.fields.getTextInputValue("staff_terlapor"),
        "Jenis Pelanggaran": interaction.fields.getTextInputValue("jenis_pelanggaran"),
        "Waktu Kejadian": interaction.fields.getTextInputValue("waktu"),
        "Kronologis": interaction.fields.getTextInputValue("kronologis")
      };
    }

    if (interaction.customId === "modal-donasi") {
      kategori = "Request Donasi";
      responses = {
        "Nama UCP": interaction.fields.getTextInputValue("ucp"),
        "Nama Karakter": interaction.fields.getTextInputValue("karakter"),
        "Jenis Donasi": interaction.fields.getTextInputValue("jenis_donasi"),
        "Pembayaran Via": interaction.fields.getTextInputValue("pembayaran")
      };
    }

    // Buat channel tiket
    const guild = client.guilds.cache.get(config.guildId);
    const categoryId = config.categories[kategori.replace(" ", "").toLowerCase()] || config.manageCategoryId;

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: config.staffRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });

    activeTickets.set(interaction.user.id, channel.id);

    const embed = ticketEmbed(interaction.user, kategori, responses, guild);
    await channel.send({ content: `<@&${config.staffRoleId}> | <@${interaction.user.id}>`, embeds: [embed] });

    await interaction.reply({ content: `✅ Tiket kamu sudah dibuat: ${channel}`, ephemeral: true });
  }
}
