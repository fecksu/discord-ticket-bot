import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Hapus user dari tiket")
  .addUserOption(opt =>
    opt.setName("user")
      .setDescription("User yang ingin dihapus")
      .setRequired(true));

export async function execute(interaction) {
  const user = interaction.options.getUser("user");
  await interaction.channel.permissionOverwrites.delete(user.id);
  await interaction.reply({ content: `❌ ${user} berhasil dihapus dari tiket.` });
}
