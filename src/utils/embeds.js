import { EmbedBuilder } from "discord.js";
import { getColorFromURL } from "color-thief-node";

const kategoriEmoji = {
  "Report Player": "👤",
  "Report Staff": "🛠️",
  "Request Donasi": "💎"
};

export async function ticketEmbed(user, kategori, responses, guild) {
  let color = "Blue"; // fallback default
  try {
    if (guild.iconURL()) {
      const [r, g, b] = await getColorFromURL(guild.iconURL({ extension: "png" }));
      color = (r << 16) + (g << 8) + b;
    }
  } catch (err) {
    console.error("Gagal ambil warna dari logo server:", err);
  }

  const emoji = kategoriEmoji[kategori] || "🎫";

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} ${kategori}`)
    .setDescription("📋 Detail laporan/donasi kamu sudah tercatat di bawah:")
    .setColor(color)
    .setThumbnail(guild.iconURL({ size: 256 }))
    .setFooter({ text: `Tiket milik ${user.tag}`, iconURL: user.displayAvatarURL() })
    .setTimestamp();

  for (const [field, value] of Object.entries(responses)) {
    embed.addFields({ name: field, value: value || "-", inline: false });
  }

  return embed;
}
