const { Profile, Theme } = require('../../models/index');

module.exports = {
    name: 'adminlevel',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    exemples: ['`/adminlevel remove level:5 <@membre>`', '`/adminlevel add level:1`'],
    usage: '`/adminlevel <add || remove> <niveaux> <@membre (facultatif)>`',
    description: 'La commande `/adminlevel` permet d\'enlever ou ajouter des thèmes à soi ou à un autre.',
    options: [
        {
            name: 'add',
            description: 'Choisir un thème à donner à un membre.',
            type: 'SUB_COMMAND',
            options: [ { name: 'level', type: 'NUMBER', description: 'Nombre de niveaux à ajouter.', required: true },
            { name: 'membre', type: 'USER', description: 'Membre qui recevra les points d\'expérience.', required: false } ]
        },
        {
            name: 'remove',
            description: 'Choisir un thème à donner à un membre.',
            type: 'SUB_COMMAND',
            options: [ { name: 'level', type: 'NUMBER', description: 'Nombre de niveaux à enlever.', required: true },
            { name: 'membre', type: 'USER', description: 'Membre à qui le thème sera retiré.', required: false } ]
        }
    ],
    async runInteraction(client, interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const level = interaction.options.getNumber('level')
            const mentionMember = interaction.options.getUser('membre');

            if (level === 0) return interaction.reply({content: `Tu ne peux pas ajouter 0 niveau...`, ephemeral: true});

            if (mentionMember) {
                const mentionProfileData = await Profile.findOne({ userId: mentionMember.id });
    
                if (!mentionProfileData) return interaction.reply({content: `Ce membre n'a pas de profil donc Miyazaki ne peut pas lui ajouter des niveaux.`, ephemeral: true});
    
                await Profile.updateOne({ userId: mentionMember.id }, {
                    '$set' : {
                                'level.level': mentionProfileData.level.level + level
                            }
                }).then(interaction.reply({ content: `Miyazaki a ajouté avec succès ${level} ${level == 1 ? "niveau" : "niveaux"} au membre ${mentionMember} !`, ephemeral: true}));

            } else {
                const profileData = await Profile.findOne({ userId: interaction.user.id });

                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                                'level.level': profileData.level.level + level
                            }
                }).then(interaction.reply({ content: `Miyazaki t'as ajouté avec succès ${level} ${level == 1 ? "niveau" : "niveaux"} !`, ephemeral: true}));
            }

        } else if (interaction.options.getSubcommand() === 'remove') {
            const level = interaction.options.getNumber('level')
            const mentionMember = interaction.options.getUser('membre');

            if (level === 0) return interaction.reply({content: `Tu ne peux pas enlever 0 niveau...`, ephemeral: true});

            if (mentionMember) {
                const mentionProfileData = await Profile.findOne({ userId: mentionMember.id });
    
                if (!mentionProfileData) return interaction.reply({content: `Ce membre n'a pas de profil donc Miyazaki ne peut pas lui enlever de niveaux.`, ephemeral: true});

                if (mentionProfileData.level.level - level < 0) {
                    await Profile.updateOne({ userId: mentionMember.id }, {
                        '$set' : {
                                    'level.level': 0
                                }
                    }).then(interaction.reply({ content: `Miyazaki a réinitialisé avec succès les niveaux du membre ${mentionMember} !`, ephemeral: true}));
                }else {
                    await Profile.updateOne({ userId: mentionMember.id }, {
                        '$set' : {
                                    'level.level': mentionProfileData.level.level - level
                                }
                    }).then(interaction.reply({ content: `Miyazaki a enlevé avec succès ${level} ${level == 1 ? "niveau" : "niveaux"} au membre ${mentionMember} !`, ephemeral: true}));
    
                };
            } else {
                const profileData = await Profile.findOne({ userId: interaction.user.id });

                if (profileData.level.level - level < 0) {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                                    'level.level': 0
                                }
                    }).then(interaction.reply({ content: `Miyazaki a réinitialisé avec succès tes niveaux !`, ephemeral: true}));
                } else {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                                    'level.level': profileData.level.level - level
                                }
                    }).then(interaction.reply({ content: `Miyazaki t'as enlevé avec succès ${level} ${level == 1 ? "niveau" : "niveaux"} !`, ephemeral: true}));
    
                };
            }

        }
    }
};