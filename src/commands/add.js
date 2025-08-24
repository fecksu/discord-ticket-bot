import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Tambah user ke tiket")
  .addUserOption(opt =>
    opt.setName("user")
      .setDescription("User yang ingin ditambahkan")
      .setRequired(true));

export async function execute(interaction) {
  const user = interaction.options.getUser("user");
  await interaction.channel.permissionOverwrites.edit(user.id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true
  });
  await interaction.reply({ content: `✅ ${user} berhasil ditambahkan ke tiket.` });
}
