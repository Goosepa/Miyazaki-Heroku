const { Profile, Theme } = require('../../models/index');

module.exports = {
    name: 'admintheme',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    exemples: ['`/admintheme add theme:0 <@membre>`', '`/admintheme remove theme:1`'],
    usage: '`/admintheme <add || remove> <id du thème> <@membre (facultatif)>`',
    description: 'La commande `/admintheme` permet d\'enlever ou ajouter des thèmes à soi ou à un autre.',
    options: [
        {
            name: 'add',
            description: 'Choisir un thème à ajouter à un membre.',
            type: 'SUB_COMMAND',
            options: [ { name: 'themeid', type: 'NUMBER', description: 'Identifiant du thème.', required: true },
            { name: 'membre', type: 'USER', description: 'Membre qui recevra le thème.', required: false } ]
        },
        {
            name: 'remove',
            description: 'Choisir un thème à enlever à un membre.',
            type: 'SUB_COMMAND',
            options: [ { name: 'themeid', type: 'NUMBER', description: 'Identifiant du thème.', required: true },
            { name: 'membre', type: 'USER', description: 'Membre à qui le thème sera retiré.', required: false } ]
        }
    ],
    async runInteraction(client, interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const theme = interaction.options.getNumber('themeid')
            const mentionMember = interaction.options.getUser('membre');

            if (mentionMember) {
                const mentionProfileData = await Profile.findOne({ userId: mentionMember.id });
                const addTheme = await Theme.findOne({ themeId: theme });
    
                if (!mentionProfileData) return interaction.reply({content: `Ce membre n'a pas de profil donc Miyazaki ne peut pas lui ajouter de thèmes.`, ephemeral: true});
    
                if (!addTheme) return interaction.reply({content: `Miyazaki ne trouve pas ce thème... Tu as peut-être fait une erreur sur l'identifiant du thème ? Voici l'identifiant que tu as saisi : ${theme}.`, ephemeral: true});
    
                if (theme || theme === 0) {
                    if (mentionProfileData.profile.theme.allThemes.includes(addTheme.themeName)) return interaction.reply({content: `Miyazaki ne peut pas ajouter ce thème car ce membre le possède déjà... Voici le thème que tu as demandé à Miyazaki d'ajouter : ${addTheme.themeName}.`, ephemeral: true});
    
                    await Profile.updateOne({ userId: mentionMember.id }, {
                        '$push' : {
                                    'profile.theme.allThemes': addTheme.themeName
                                }
                    }).then(interaction.reply({ content: `Miyazaki a ajouté avec succès le thème "${addTheme.themeName}" au membre ${mentionMember} !`, ephemeral: true}));
    
                };
            } else {
                const profileData = await Profile.findOne({ userId: interaction.user.id });
                const addTheme = await Theme.findOne({ themeId: theme });
    
                if (!addTheme) return interaction.reply({content: `Miyazaki ne trouve pas ce thème... Tu as peut-être fait une erreur sur l'identifiant du thème ? Voici l'identifiant que tu as saisi : ${theme}.`, ephemeral: true});
    
                if (addTheme || addTheme === 0) {
                    if (profileData.profile.theme.allThemes.includes(addTheme.themeName)) return interaction.reply({content: `Miyazaki ne peut pas t'ajouter ce thème car tu le possèdes déjà... Voici le thème que tu as demandé à Miyazaki d'ajouter : ${addTheme.themeName}.`, ephemeral: true});
    
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$push' : {
                                    'profile.theme.allThemes': addTheme.themeName
                                }
                    }).then(interaction.reply({ content: `Miyazaki a ajouté avec succès le thème : ${addTheme.themeName} !`, ephemeral: true}));
    
                };
            }

        } else if (interaction.options.getSubcommand() === 'remove') {
            const theme = interaction.options.getNumber('themeid')
            const mentionMember = interaction.options.getUser('membre');

            if (mentionMember) {
                const mentionProfileData = await Profile.findOne({ userId: mentionMember.id });
                const removeTheme = await Theme.findOne({ themeId: theme });
    
                if (!mentionProfileData) return interaction.reply({content: `Ce membre n'a pas de profil donc Miyazaki ne peut pas lui ajouter de thèmes.`, ephemeral: true});
    
                if (!removeTheme) return interaction.reply({content: `Miyazaki ne trouve pas ce thème... Tu as peut-être fait une erreur sur l'identifiant du thème ? Voici l'identifiant que tu as saisi : ${theme}.`, ephemeral: true});

                if (theme === 0) return interaction.reply({content: `Tu ne peux pas enlever le thème par défaut.`, ephemeral: true});
    
                if (theme) {
                    if (!mentionProfileData.profile.theme.allThemes.includes(removeTheme.themeName)) return interaction.reply({content: `Miyazaki ne peut pas enlever ce thème car ce membre ne le possède pas... Voici le thème que tu as demandé à Miyazaki d'enlever : ${removeTheme.themeName}.`, ephemeral: true});

                    if (mentionProfileData.profile.theme.usedTheme === removeTheme.themeName) {
                        await Profile.updateOne({ userId: mentionMember.id }, {
                            '$set' : {
                                        'profile.theme.usedTheme': 'Thème par défaut'
                                    }
                        });
                    };
    
                    await Profile.updateOne({ userId: mentionMember.id }, {
                        '$pull' : {
                                    'profile.theme.allThemes': removeTheme.themeName
                                }
                    }).then(interaction.reply({ content: `Miyazaki a enlevé avec succès le thème "${removeTheme.themeName}" du membre ${mentionMember} !`, ephemeral: true}));
    
                };
            } else {
                const profileData = await Profile.findOne({ userId: interaction.user.id });
                const removeTheme = await Theme.findOne({ themeId: theme });
    
                if (!removeTheme) return interaction.reply({content: `Miyazaki ne trouve pas ce thème... Tu as peut-être fait une erreur sur l'identifiant du thème ? Voici l'identifiant que tu as saisi : ${theme}.`, ephemeral: true});

                if (theme === 0) return interaction.reply({content: `Tu ne peux pas enlever le thème par défaut.`, ephemeral: true});
    
                if (removeTheme) {
                    if (!profileData.profile.theme.allThemes.includes(removeTheme.themeName)) return interaction.reply({content: `Miyazaki ne peut pas t'enlever ce thème car tu ne le possèdes pas... Voici le thème que tu as demandé à Miyazaki d'enlever : ${removeTheme.themeName}.`, ephemeral: true});

                    if (profileData.profile.theme.usedTheme === removeTheme.themeName) {
                        await Profile.updateOne({ userId: interaction.user.id }, {
                            '$set' : {
                                        'profile.theme.usedTheme': 'Thème par défaut'
                                    }
                        });
                    };
    
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$pull' : {
                                    'profile.theme.allThemes': removeTheme.themeName
                                }
                    }).then(interaction.reply({ content: `Miyazaki a enlevé avec succès le thème : ${removeTheme.themeName} !`, ephemeral: true}));
    
                };
            }

        }
    }
};