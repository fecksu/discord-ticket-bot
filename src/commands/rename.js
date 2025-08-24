import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("rename")
  .setDescription("Ubah nama channel tiket")
  .addStringOption(opt =>
    opt.setName("nama")
      .setDescription("Nama baru channel")
      .setRequired(true));

export async function execute(interaction) {
  const newName = interaction.options.getString("nama");
  await interaction.channel.setName(newName);
  await interaction.reply({ content: `✅ Nama channel diubah menjadi **${newName}**.` });
}
