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
        await Profile.updateMany({}, {
            "$set" : {
                'quests': {
                    'dailies': {
                        'combo': 0,
                        'messages': 0,
                        'mentions': 0,
                        'event': 0,
                        'commission': 0,
                        'reward': 0
                    },
                    'mains': {
                        'intro': {
                            'save': 0,
                        }
                    },
                    'hangouts': {
                        'belladone1': {
                            'save': 0,
                        }
                    }
                },
                'casino': {
                    'dailyPulls': 0,
                    'pityPoints': 0,
                    'pity': 0
                }
            }
        });

        interaction.reply(`Miyazaki a mis à jour la base de données !`)
    }
};