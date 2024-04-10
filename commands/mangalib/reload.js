const { SlashCommandBuilder } = require('discord.js');
const container = require('../../container.js');
const Team = container.database.model('team');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Обновляет все данные в базе данных, не отправляя уведомления'),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const team = await Team.findOne({ where: { serverId: serverId } });
        if (team == null) {
            interaction.reply({
                content: 'Сначала запустите /setup, чтобы установить бота.',
                ephemeral: true,
            });
            return;
        }
        interaction.reply({
            content: 'Обновление данных...',
            ephemeral: true,
        });

        const teamReply = await container.network.get(`/teams/${team.mangalibId}`)
            .catch(error => {
                console.error(`Failed to fetch team's data: ${error}`);
                throw error;
            });
        const data = teamReply.data.data;
        await team.update({
            name: data.name,
        });

        await container.sync_db(team, container.database, container.network);

        await interaction.editReply({
            content: 'Всё готово! Я обновил все свои данные!',
            ephemeral: true,
        });
    },
};
