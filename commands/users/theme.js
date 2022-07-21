const { Profile, Theme } = require('../../models/index');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'theme',
    category: 'users',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/profil signature : <nouvelle signature>`','`/profil <@membre>`'],
    usage: '`/profil <option || membre>`',
    description: 'La commande `/theme` permet de changer ou d\'afficher les thèmes que tu possèdes.',
    options: [
        {
            name: 'change',
            description: `Veuillez indiquer l'ID du thème : changer: <id>`,
            type: 'NUMBER',
            required: false,  
        },
        {
            name: 'member',
            description: `Affiche tous les thèmes que quelqu'un d'autre possède.`,
            type: 'USER',
            required: false, 
        },
        {
            name: 'allthemes',
            description: `Affiche tous les thèmes que quelqu'un d'autre possède.`,
            type: 'USER',
            required: false, 
        }
    ],
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({ userId: interaction.user.id });
        const themeData = await Theme.findOne({ themeName: profileData.profile.theme.usedTheme });

        if (interaction.options.getNumber('change') || interaction.options.getNumber('change') === 0) {
            console.log('ok')
            const wantedTheme = interaction.options.getNumber('change');
            const themeData = await Theme.findOne({ themeId: wantedTheme });

            if (themeData) {
                if (!profileData.profile.theme.allThemes.includes(themeData.themeName)) {
                    return interaction.reply({ content: `Désolé, Miyazaki ne peut pas te mettre ce thème car tu ne l'as pas... Si tu veux on peut trouver un moyen de l'avoir !`,   ephemeral: true})
                } else {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                                    'profile.theme.usedTheme': themeData.themeName
                                }
                    }).then(interaction.reply({ content: `Miyazaki a changé ton thème avec succès !`, ephemeral: true}))
                }
            } else return interaction.reply({ content: `Désolé, Miyazaki ne trouve pas ce thème.`, ephemeral: true})
        } else if (interaction.options.getUser('member')) {
            const mentionUser = interaction.options.getUser('member')
            const mentionProfileData = await Profile.findOne({ userId: mentionUser.id });

            if (!mentionProfileData) return interaction.reply({content: `Je suis désolé, Miyazaki n'a pas trouvé le profile de ${mentionUser}... Il se peut qu'il n'en ait pas encore.`, ephemeral: true});

            const mentionThemeData = await Theme.findOne({ themeName: mentionProfileData.profile.theme.usedTheme })

            const embed = new MessageEmbed()
            .setTitle(`${mentionThemeData.themeEmote} Thème actuel — ${mentionThemeData.themeName}`)
            .setDescription(`${mentionThemeData.themeQuote}`)
            .setColor(`${mentionThemeData.themeColor}`)
            .setFields(
                {
                    name: `Description :`, value: `${mentionThemeData.themeDescription}`, inline: false
                },
                {
                    name: `Couleur du thème :`, value: `#${mentionThemeData.themeColor}`, inline: true
                },
                {
                    name: `Emote du thème :`, value: `${mentionThemeData.themeEmote}`, inline: true
                },
                {
                    name: `Identifiant :`, value: `${mentionThemeData.themeId}`, inline: true
                }
            )
            .setImage(mentionThemeData.themeImage)
            .setTimestamp()
            .setFooter({text: `Thème de ${mentionUser.nickname || mentionUser.username}`, iconURL: mentionUser.displayAvatarURL()})

            const embed2 = new MessageEmbed()
            .setTitle(`${mentionThemeData.themeEmote} Tous les thèmes de ${mentionUser.nickname || mentionUser.username}`)
            .setColor(`${mentionThemeData.themeColor}`)
            .setTimestamp()
            .setFooter({text: `Thèmes de ${mentionUser.nickname || mentionUser.username}`, iconURL: mentionUser.displayAvatarURL()})
            const embed3 = new MessageEmbed()
            .setTitle(`${mentionThemeData.themeEmote} Tous les thèmes de ${mentionUser.nickname || mentionUser.username}`)
            .setColor(`${mentionThemeData.themeColor}`)
            .setTimestamp()
            .setFooter({text: `Thèmes de ${mentionUser.nickname || mentionUser.username}`, iconURL: mentionUser.displayAvatarURL()}) 

            var i = 0
            
            for (len = mentionProfileData.profile.theme.allThemes.length; i < len && i <= 24; i++) {
                const themeToList = await Theme.findOne({ themeName: mentionProfileData.profile.theme.allThemes[i] });

                embed2.addFields(
                    {
                        name: `${themeToList.themeEmote} ${mentionProfileData.profile.theme.allThemes[i]}`,
                        value: `${themeToList.themeDescription}\n**Couleur :** #${themeToList.themeColor} — **ID :** ${themeToList.themeId}`
                    }
                    );
            }

            if (i = 25) for (len = mentionProfileData.profile.theme.allThemes.length; i < len && i <= 50; i++) {
                const themeToList = await Theme.findOne({ themeName: mentionProfileData.profile.theme.allThemes[i] });

                embed3.addFields(
                    {
                        name: `${themeToList.themeEmote} ${mentionProfileData.profile.theme.allThemes[i]}`,
                        value: `${themeToList.themeDescription}\n**Couleur :** #${themeToList.themeColor} — **ID :** ${themeToList.themeId}`
                    }
                );
                return interaction.reply({ embeds: [embed, embed2, embed3] })
            }
            
            return interaction.reply({ embeds: [embed, embed2], })
        } else {     
            const embed = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Thème actuel — ${themeData.themeName}`)
            .setDescription(`${themeData.themeQuote}`)
            .setColor(`${themeData.themeColor}`)
            .setFields(
                {
                    name: `Description :`, value: `${themeData.themeDescription}`, inline: false
                },
                {
                    name: `Couleur du thème :`, value: `#${themeData.themeColor}`, inline: true
                },
                {
                    name: `Emote du thème :`, value: `${themeData.themeEmote}`, inline: true
                },
                {
                    name: `Identifiant :`, value: `${themeData.themeId}`, inline: true
                }
            )
            .setImage(themeData.themeImage)
            .setTimestamp()
            .setFooter({text: `Thème de ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})

            const embed2 = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Tous les thèmes de ${interaction.member.nickname || interaction.user.username}`)
            .setColor(`${themeData.themeColor}`)
            .setTimestamp()
            .setFooter({text: `Thèmes de ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
            const embed3 = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Tous les thèmes de ${interaction.member.nickname || interaction.user.username}`)
            .setColor(`${themeData.themeColor}`)
            .setTimestamp()
            .setFooter({text: `Thèmes de ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()}) 

            var i = 0
            
            for (len = profileData.profile.theme.allThemes.length; i < len && i <= 24; i++) {
                const themeToList = await Theme.findOne({ themeName: profileData.profile.theme.allThemes[i] });

                embed2.addFields(
                    {
                        name: `${themeToList.themeEmote} ${profileData.profile.theme.allThemes[i]}`,
                        value: `${themeToList.themeDescription}\n**Couleur :** #${themeToList.themeColor} — **ID :** ${themeToList.themeId}`
                    }
                    );
            }

            if (i = 25) for (len = profileData.profile.theme.allThemes.length; i < len && i <= 50; i++) {
                const themeToList = await Theme.findOne({ themeName: profileData.profile.theme.allThemes[i] });

                embed3.addFields(
                    {
                        name: `${themeToList.themeEmote} ${profileData.profile.theme.allThemes[i]}`,
                        value: `${themeToList.themeDescription}\n**Couleur :** #${themeToList.themeColor} — **ID :** ${themeToList.themeId}`
                    }
                );
                return interaction.reply({ embeds: [embed2, embed3] })
            }
            
            return interaction.reply({ embeds: [embed, embed2] })
        }
        
    }
}
