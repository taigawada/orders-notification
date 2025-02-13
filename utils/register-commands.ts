import "dotenv/config";
import { REST, Routes } from "discord.js";
import fs from "fs/promises";
import path from "path";

async function registerCommands() {
  const commands: string[] = [];
  // Grab all the command folders from the commands directory you created earlier
  const foldersPath = path.join(path.dirname(__dirname), "commands");
  const commandFolders = await fs.readdir(foldersPath);

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter((file) =>
      file.endsWith(".ts"),
    );
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_APP_ID!,
          process.env.DISCORD_GUILD_ID!,
        ),
        { body: commands },
      );

      console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
}

registerCommands();
