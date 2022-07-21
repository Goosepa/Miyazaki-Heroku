const { Guild } = require('../../models/index');

module.exports = {
    name: 'reload',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/reload`'],
    usage: '`/reload`',
    description: 'La commande `/reload` permet de reload Miyazaki.',
    async runInteraction(client, interaction) { 
        await interaction.reply(`Miyazaki relancé avec succès !`)
        return process.exit()
    }
};