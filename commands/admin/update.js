const { Guild, Profile, Theme, Item } = require('../../models/index');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'update',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/update`'],
    usage: '`/update`',
    description: 'La commande `/update` permet de mettre à jour les données de la base de données.',
    async runInteraction(client, interaction) {
        await Profile.updateMany({}, {
            '$set': {
                'quests.dailies.reward': 0
            }
        })
    }
};