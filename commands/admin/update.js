const { Guild, Profile, Theme, Quest, Item } = require('../../models/index');

module.exports = {
    name: 'update',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/update`'],
    usage: '`/update`',
    description: 'La commande `/update` permet de mettre à jour les données de la base de données.',
    async runInteraction(client, interaction) {
        await Guild.updateMany({}, {upsert: true});

        await Profile.updateMany({}, {
            '$set': {
                'inventory': [ {name: "Pass Radieux", quantity: 1, category: "Objets de quête", itemEmote:"🎟️"}, {name: "Jeton du Casino Belladone", quantity: 100, category: "Objets échangeables", itemEmote:"🪙"} ]
            }
        });

        await new Quest({}, {

        });

        await new Item({}, {
        })

        interaction.reply(`Miyazaki a mis à jour la base de données !`)
    }
};