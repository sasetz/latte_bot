const { SlashCommandBuilder } = require('discord.js');
const { Op } = require('sequelize');
const container = require('../../container.js');
const Team = container.database.model('team');
const Title = container.database.model('title');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_role')
        .setDescription('Назначает роль для определённого тайтла.')
        .addRoleOption(option =>
            option.setName('роль')
                .setDescription('Роль, которая будет указываться для пинга')
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName('тайтл')
                .setDescription('Тайтл, на который будет подписана эта роль')
                .setRequired(true)
                .setAutocomplete(true),
        ),
    async execute(interaction) {
        const role = interaction.options.getRole('роль');
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

        await interaction.reply({
            content: 'Обновление данных...',
            ephemeral: true,
        });

        await title.update({
            roleId: role.id,
        });

        await interaction.editReply({
            content: 'Роль успешно присвоена тайтлу.',
            ephemeral: true,
        });
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
