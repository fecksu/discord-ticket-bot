import { saveTranscript } from "../utils/transcript.js";

export const name = "guildMemberRemove";

export async function execute(member, client) {
  const ticket = member.guild.channels.cache.find(ch => ch.topic === member.id);
  if (ticket) {
    const transcriptFile = await saveTranscript(ticket);
    try {
      await member.send({ content: "📑 Berikut transkrip tiket Anda:", files: [transcriptFile] });
    } catch {}
    await ticket.delete();
  }
}
