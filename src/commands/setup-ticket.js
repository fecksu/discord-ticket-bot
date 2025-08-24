import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setup-ticket")
  .setDescription("Setup panel tiket")
  .addChannelOption(opt =>
    opt.setName("kirim_ke")
      .setDescription("Channel tempat panel dikirim")
      .setRequired(true));

export async function execute(interaction) {
  if (!interaction.member.permissions.has("Administrator")) {
    return interaction.reply({ content: "❌ Hanya admin yang bisa setup tiket.", ephemeral: true });
  }

  const channel = interaction.options.getChannel("kirim_ke");

  const embed = new EmbedBuilder()
    .setTitle("🎫 Sistem Tiket")
    .setDescription("Silakan pilih kategori tiket di bawah untuk membuat tiket baru.")
    .setColor("Blue");

  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket-category")
    .setPlaceholder("Pilih kategori tiket")
    .addOptions([
      { label: "Report Player", value: "reportPlayer", emoji: "👤" },
      { label: "Report Staff", value: "reportStaff", emoji: "🛠️" },
      { label: "Request Donasi", value: "requestDonasi", emoji: "💎" }
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  await channel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: "✅ Panel tiket berhasil dikirim.", ephemeral: true });
}
