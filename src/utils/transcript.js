import fs from "fs-extra";

export async function saveTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  let html = `<html><body><h1>Transcript ${channel.name}</h1>`;
  for (const msg of sorted.values()) {
    html += `<p>[${new Date(msg.createdTimestamp).toLocaleString()}] <b>${msg.author.tag}</b>: ${msg.content}</p>`;
  }
  html += "</body></html>";

  const file = `./${channel.id}-transcript.html`;
  await fs.writeFile(file, html);
  return file;
}
