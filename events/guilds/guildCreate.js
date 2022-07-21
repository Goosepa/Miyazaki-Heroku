const { Guild } = require('../../models/index');

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        await client.createGuild(guild)
    }
};