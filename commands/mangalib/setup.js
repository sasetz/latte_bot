const { SlashCommandBuilder, ChannelType } = require('discord.js');
const container = require('../../container.js');
const Team = container.database.model('team');
const Title = container.database.model('title');
const Chapter = container.database.model('chapter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Устанавливает бота, позволяет выбрать команду, настроить канал и интервал проверки новинок.')
        .addStringOption(option =>
            option.setName('команда')
                .setDescription('Название команды на Мангалибе')
                .setRequired(true)
                .setAutocomplete(true))
        .addChannelOption(option => 
            option.setName('канал')
                .setDescription('Канал, куда будут отправляться уведомления о главах. По умолчанию: этот канал')
                .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption(option =>
            option.setName('интервал')
                .setDescription('Время (в минутах), за которое будет проверяться Мангалиб. По умолчанию: 5 минут')
        ),
    async execute(interaction) {
        const teamId = interaction.options.getString('команда');
        const channel = interaction.options.getChannel('канал') ?? interaction.channel;
        const timer = interaction.options.getInteger('интервал') ?? 5;

        if (typeof teamId !== 'numeric') {
            console.log('==============================================');
        }

        await interaction.reply({
            content: 'Обработка, пожалуйста, подождите...',
            ephemeral: true,
        });

        const teamReply = await container.network.get(`/teams/${teamId}`)
            .catch(error => {
                console.error(`Failed to fetch team's data: ${error}`);
                throw error;
            });
        const data = teamReply.data.data;
        // TODO: submit issue to sequelize, since findOrCreate does not 
        // provide methods for saving (at all)

        let storedTeam = await Team.findOne({
            where: {
                mangalibId: teamId,
            },
        });
        if (storedTeam == null) {
            storedTeam = await Team.create({
                name: data.name,
                timeout: timer,
                mangalibId: data.id,
                channelId: channel.id,
                serverId: channel.guildId,
            });
        }
        await storedTeam.update({
            name: data.name,
            timeout: timer,
            channelId: channel.id,
            serverId: channel.guildId,
        });

        await container.sync_db(storedTeam, container.database, container.network);

        await interaction.editReply({
            content: 'Всё готово! Я обновил все свои данные!',
            ephemeral: true,
        });
    },

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const queryResult = await container.network.get('/teams', {
            params: {
                q: focusedValue,
            },
        })
        .catch(async error => {
            console.log(error);
            await interaction.respond([{name: 'Ошибка получения команд из Мангалиба. Попробуйте позже.', value: 'null'}]);
        });

        const filteredOptions = queryResult.data.data.map(team => ({ name: team.name, value: team.id.toString() }));
        console.log(filteredOptions)
        await interaction.respond(
            filteredOptions,
        )
    },
};
