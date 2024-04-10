const { EmbedBuilder } = require('discord.js');

module.exports = async (chapter, channel, network) => {
    // TODO: save all the necessary data in the database, without needing
    // to request it each time
    let shouldContinue = true;
    while (shouldContinue) {
        const response = network.get('/teams', {
            params: {
            }
        })
    }
    const embed = new EmbedBuilder()
        .addTitle()
}
