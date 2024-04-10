const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (
            !interaction.isAutocomplete() &&
            !interaction.isChatInputCommand()
        ) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (interaction.isAutocomplete()) {
            try {
                await command.autocomplete(interaction);
            }
            catch (error) {
                console.error('Error while autocompleting!', error);
            }
        }
        else {
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                const response = {
                    content: 'Упс! Произошла ошибка при выполнении команды.',
                    ephemeral: true,
                };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(response);
                }
                else {
                    await interaction.reply(response);
                }
            }
        }
    },
};
