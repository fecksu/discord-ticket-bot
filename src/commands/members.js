import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("members")
  .setDescription("Lihat siapa saja yang ada di tiket");

export async function execute(interaction) {
  const members = interaction.channel.members.map(m => `${m.user.tag}`).join("\n");
  await interaction.reply({ content: `👥 Anggota tiket:\n${members}` });
}
