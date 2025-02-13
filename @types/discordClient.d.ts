import type { Collection } from "discord.js";

interface AutocompleteSlashCommands {
  execute: (interaction: CommandInteraction) => Promise<void>;
  autocomplete: (interaction: CommandInteraction) => Promise<void>;
}

declare module "discord.js" {
  interface Client {
    commands: Collection<string, AutocompleteSlashCommands>;
  }
}
