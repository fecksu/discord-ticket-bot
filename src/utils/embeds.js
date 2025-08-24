import { EmbedBuilder } from "discord.js";

export function ticketEmbed(user, category, reason) {
  return new EmbedBuilder()
    .setTitle(`🎫 Tiket dari ${user.username}`)
    .setDescription(`Kategori: **${category}**\nAlasan: ${reason}`)
    .setColor("Blue")
    .setFooter({ text: "Sistem Tiket Otomatis" })
    .setTimestamp();
}
