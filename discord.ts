import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

declare global {
  // eslint-disable-next-line no-var
  var discord: Client;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.discord) {
    global.discord = new Client({
      intents: [GatewayIntentBits.Guilds],
    });
  }
}

const discord: Client =
  global.discord ||
  new Client({
    intents: [GatewayIntentBits.Guilds],
  });

export default discord;

export async function loginDiscord(client: Client) {
  client.commands = new Collection();

  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = await fs.readdir(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter((file) =>
      file.endsWith(".ts"),
    );
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command.execute);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  await client.login(process.env.DISCORD_TOKEN);
  console.log("login to discord!");
}

// discordClient.once(Events.ClientReady, async (readyClient) => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);

//   const channel: BaseGuildTextChannel = discordClient.channels.cache.get(
//     "1305201158884692079",
//   ) as BaseGuildTextChannel;
//   // const button = new ButtonBuilder()
//   //   .setCustomId("button1")
//   //   .setLabel("Click it!")
//   //   .setStyle(ButtonStyle.Primary);
//   // const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
//   //   button
//   // );
//   // await channel.send({ content: "hello world!", components: [actionRow] });

//   const nickName = "ひがし";
//   const realName = "東寛之";
//   const lineItems = [
//     { name: "・単独衣装チェキ ×8", value: "あみな/なし", inline: false },
//     { name: "・単独衣装チェキ ×2", value: "りり/なし", inline: false },
//     { name: "・ペンライト ×2", value: "\n", inline: false },
//     { name: "・単独衣装チェキ ×2", value: "りり/なし", inline: false },
//   ];
//   const amount = "12,400";
//   const userIds = ["1120206950500679721", "1305210158930067479"];

//   const users = await Promise.all(
//     userIds.map((userId) => discordClient.users.fetch(userId)),
//   );

//   const exampleEmbed = new EmbedBuilder()
//     .setColor(0x0099ff)
//     .setTitle(
//       `オンラインストアから${lineItems.length}アイテムの新しい注文がありました`,
//     )
//     .setDescription(
//       `${users.join(" ")}\n**お客様**\n${nickName}\n${realName}\n`,
//     )
//     .addFields(...lineItems)
//     .setFooter({ text: `合計金額は${amount}円です` })
//     .setTimestamp();
//   await channel.send({ embeds: [exampleEmbed] });
// });

// discordClient.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   const command = interaction.client.commands.get(interaction.commandName);
//   if (!command) {
//     console.error(
//       `No command matching ${interaction.commandName} was found.`,
//     );
//     return;
//   }
//   try {
//     await command(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: "There was an error while executing this command!",
//         ephemeral: true,
//       });
//     } else {
//       await interaction.reply({
//         content: "There was an error while executing this command!",
//         ephemeral: true,
//       });
//     }
//   }
// });
