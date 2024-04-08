const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Reports information about the user.'),
    async execute(interaction) {
        await interaction.reply(`This command was executed by ${interaction.user.username}, on ${interaction.createdAt.toString()}`)
    },
};
