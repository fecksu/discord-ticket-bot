import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import fs from "fs-extra";
import path from "path";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(process.cwd(), "src/commands");
for (const file of await fs.readdir(commandsPath)) {
  if (file.endsWith(".js")) {
    const cmd = await import(`./src/commands/${file}`);
    client.commands.set(cmd.data.name, cmd);
  }
}

// Load events
const eventsPath = path.join(process.cwd(), "src/events");
for (const file of await fs.readdir(eventsPath)) {
  if (file.endsWith(".js")) {
    const evt = await import(`./src/events/${file}`);
    if (evt.once) {
      client.once(evt.name, (...args) => evt.execute(...args, client));
    } else {
      client.on(evt.name, (...args) => evt.execute(...args, client));
    }
  }
}

// Config check
const configPath = "./src/config.json";
if (!fs.existsSync(configPath)) {
  const example = {
    guildId: "",
    staffRoleId: "",
    manageCategoryId: "",
    categories: {
      reportPlayer: "",
      reportStaff: "",
      requestDonasi: ""
    },
    autoCloseMinutes: 60,
    warnBeforeCloseMinutes: 55,
    emojis: {
      success: "✅",
      error: "❌",
      ticket: "🎫",
      staff: "🛠️"
    }
  };
  await fs.writeJSON(configPath, example, { spaces: 2 });
  console.log("⚠️ Harap isi src/config.json sebelum menjalankan bot!");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
