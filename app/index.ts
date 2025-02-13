import { fastifyStart } from "./routes";
import discord, { loginDiscord } from "../utils/discord";

async function main() {
  await loginDiscord(discord);
  await fastifyStart();
}

main();
