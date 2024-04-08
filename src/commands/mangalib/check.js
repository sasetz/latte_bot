const { SlashCommandBuilder } = require('discord.js');
const container = require('../../container.js');
const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.lib.social/api/',
    timeout: 1000,
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Queries Mangalib whether new chapters have been published.'),
    async execute(interaction) {
        await instance.get('/teams/35207/chapters')
            .then(function (response) {
                const data = response.data.data
                console.log(response);
                interaction.reply(`Length of data: ${data.length}`);
            })
            .catch(function (error) {
                console.error("Failed to reach Mangalib.");
                console.log(error);
            })
        await container.database.authenticate()
            .then(() =>{
                console.log('Connection with database established successfully.');
            })
            .catch(() => {
                console.error('Unable to connect to the database:', error);
            })
    },
};
