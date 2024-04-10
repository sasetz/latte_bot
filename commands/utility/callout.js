const { SlashCommandBuilder } = require('discord.js');
const sequelize = require('sequelize');
const { Op } = sequelize;
const container = require('../../container.js');
const Team = container.database.model('team');
const Title = container.database.model('title');
const Chapter = container.database.model('chapter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('callout')
        .setDescription('Протестировать пинг последней главы в выбранном тайтле. Как будто бы её только что запостили!')
        .addStringOption(option =>
            option.setName('тайтл')
                .setDescription('Название тайтла, который будет тестироваться')
                .setRequired(true)
                .setAutocomplete(true),
        ),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const team = await Team.findOne({ where: { serverId: serverId } });

        if (team == null) {
            await interaction.reply({
                content: 'Сначала запустите /setup, чтобы установить бота.',
                ephemeral: true,
            });
            return;
        }

        const title = await Title.findOne({
            where: {
                titleRu: {
                    [Op.like]: interaction.options.getString('тайтл') + '%',
                },
                teamId: team.id,
            },
        });

        if (title == null) {
            await interaction.reply({
                content: 'Пожалуйста, укажите валидный тайтл.',
                ephemeral: true,
            });
            return;
        }

        if (title.roleId == null) {
            await interaction.reply({
                content: 'К этому тайтлу не прикреплена роль, используйте /set_role, чтобы назначить роль уведомлений',
                ephemeral: true,
            });
            return;
        }

        const channel = container.client.channels.cache.get(team.channelId);
        const chapter = await Chapter.findOne({ where: { titleId: title.id }, order: sequelize.fn('max', sequelize.col('publishedAt')) });
        if (chapter == null) {
            await interaction.reply({
                content: 'В этом тайтле нет глав!',
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            content: 'Отправляем уведомление...',
            ephemeral: true,
        });

        await container.notify(chapter, channel, container.network);
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const serverId = interaction.guildId;
        const team = await Team.findOne({ where: { serverId: serverId } });
        const titles = await Title.findAll({
            where: {
                titleRu: {
                    [Op.like]: focusedValue + '%',
                },
                teamId: team.id,
            },
            limit: 24,
        });
        await interaction.respond(
            titles.map(title => ({
                name: title.titleRu,
                value: title.titleRu,
            })),
        );
    },
};
