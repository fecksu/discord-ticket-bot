export const name = "ready";
export const once = true;

export async function execute(client) {
  console.log(`✅ Bot login sebagai ${client.user.tag}`);
}
