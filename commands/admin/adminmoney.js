const { Profile, Theme } = require('../../models/index');

module.exports = {
    name: 'adminmoney',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    exemples: ['`/adminmoney add money:1000 <@membre>`', '`/adminmoney remove money:2500`'],
    usage: '`/adminmoney <add || remove> <montant> <@membre (facultatif)>`',
    description: 'La commande `/adminmoney` permet d\'enlever ou ajouter de l\'argent à soi ou à un autre.',
    options: [
        {
            name: 'add',
            description: 'Choisir un nombre de niveaux à ajouter à un membre.',
            type: 'SUB_COMMAND',
            options: [ { name: 'money', type: 'NUMBER', description: 'Nombre de niveaux à ajouter.', required: true },
            { name: 'membre', type: 'USER', description: 'Membre qui recevra les niveaux.', required: false } ]
        },
        {
            name: 'remove',
            description: 'Choisir un nombre de niveaux à enlever à un membre.',
            type: 'SUB_COMMAND',
            options: [ { name: 'money', type: 'NUMBER', description: 'Nombre de niveaux à enlever.', required: true },
            { name: 'membre', type: 'USER', description: 'Membre qui se verra retirer les niveaux', required: false } ]
        }
    ],
    async runInteraction(client, interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const money = interaction.options.getNumber('money')
            const mentionMember = interaction.options.getUser('membre');

            if (money === 0) return interaction.reply({content: `Tu ne peux pas ajouter 0 fragment polaire...`, ephemeral: true});

            if (mentionMember) {
                const mentionProfileData = await Profile.findOne({ userId: mentionMember.id });
    
                if (!mentionProfileData) return interaction.reply({content: `Ce membre n'a pas de profil donc Miyazaki ne peut pas lui ajouter des fragments polaires.`, ephemeral: true});
    
                await Profile.updateOne({ userId: mentionMember.id }, {
                    '$set' : {
                                'economy.coins': mentionProfileData.economy.coins + money
                            }
                }).then(interaction.reply({ content: `Miyazaki a ajouté avec succès ${money} ${money == 1 ? "fragment polaire" : "fragments polaires"} au membre ${mentionMember} !`, ephemeral: true}));

            } else {
                const profileData = await Profile.findOne({ userId: interaction.user.id });

                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                                'economy.coins': profileData.economy.coins + money
                            }
                }).then(interaction.reply({ content: `Miyazaki t'as ajouté avec succès ${money} ${money == 1 ? "fragment polaire" : "fragments polaires"} !`, ephemeral: true}));
            }

        } else if (interaction.options.getSubcommand() === 'remove') {
            const money = interaction.options.getNumber('money')
            const mentionMember = interaction.options.getUser('membre');

            if (money === 0) return interaction.reply({content: `Tu ne peux pas enlever 0 fragment polaire...`, ephemeral: true});

            if (mentionMember) {
                const mentionProfileData = await Profile.findOne({ userId: mentionMember.id });
    
                if (!mentionProfileData) return interaction.reply({content: `Ce membre n'a pas de profil donc Miyazaki ne peut pas lui enlever de fragments polaires.`, ephemeral: true});

                if (mentionProfileData.economy.coins - money < 0) {
                    await Profile.updateOne({ userId: mentionMember.id }, {
                        '$set' : {
                                    'economy.coins': 0
                                }
                    }).then(interaction.reply({ content: `Miyazaki a réinitialisé avec succès les fragments polaires du membre ${mentionMember} !`, ephemeral: true}));
                }else {
                    await Profile.updateOne({ userId: mentionMember.id }, {
                        '$set' : {
                                    'economy.coins': mentionProfileData.economy.coins - money
                                }
                    }).then(interaction.reply({ content: `Miyazaki a enlevé avec succès ${money} ${money == 1 ? "fragment polaire" : "fragments polaires"} au membre ${mentionMember} !`, ephemeral: true}));
    
                };
            } else {
                const profileData = await Profile.findOne({ userId: interaction.user.id });

                if (profileData.economy.coins - money < 0) {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                                    'economy.coins': 0
                                }
                    }).then(interaction.reply({ content: `Miyazaki a réinitialisé avec succès tes fragments polaires !`, ephemeral: true}));
                } else {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                                    'economy.coins': profileData.economy.coins - money
                                }
                    }).then(interaction.reply({ content: `Miyazaki t'as enlevé avec succès ${money} ${money == 1 ? "fragment polaire" : "fragments polaires"} !`, ephemeral: true}));
    
                };
            }

        }
    }
};