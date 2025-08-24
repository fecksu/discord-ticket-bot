import { SlashCommandBuilder } from "discord.js";
import { saveTranscript } from "../utils/transcript.js";

export const data = new SlashCommandBuilder()
  .setName("close")
  .setDescription("Tutup tiket")
  .addBooleanOption(opt =>
    opt.setName("force")
      .setDescription("Tutup secara paksa (staff only)"));

export async function execute(interaction) {
  const force = interaction.options.getBoolean("force") || false;

  const transcriptFile = await saveTranscript(interaction.channel);
  try {
    await interaction.user.send({ content: "📑 Berikut transkrip tiket Anda:", files: [transcriptFile] });
  } catch { /* jika DM off */ }

  await interaction.reply({ content: `Tiket ditutup ${force ? "oleh staff" : "otomatis"}.`, ephemeral: true });
  setTimeout(() => interaction.channel.delete(), 2000);
}
