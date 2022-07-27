const { Guild, Profile, Theme, Item } = require('../../models/index');

module.exports = {
    name: 'update',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/update`'],
    usage: '`/update`',
    description: 'La commande `/update` permet de mettre à jour les données de la base de données.',
    async runInteraction(client, interaction) {
        const newItem = await new Item({
            guildId: '769191265756512294',
            itemName: `Gâteau d'anniversaire`,
            itemDescription: `Un petit gâteau pas top visuellement mais préparé avec amour !`,
            itemId: 2,
            itemCategory: 'Collectionnable',
            itemEmote: '🎂'
        });

        await newItem.save();

        interaction.reply(`Miyazaki a mis à jour la base de données !`)
    }
};