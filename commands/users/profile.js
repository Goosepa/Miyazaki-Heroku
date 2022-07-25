const { MessageEmbed } = require('discord.js');
const { Profile, Theme } = require('../../models/index')

module.exports = {
    name: 'profile',
    category: 'users',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/profile signature : <nouvelle signature>`','`/profile <@membre>`'],
    usage: '`/profile <option || membre>`',
    description: 'La commande `/profile` permet de montre votre profil ou de montrer celui du membre mentionné.',
    options: [
        {
            name: 'member',
            description: `Veuillez indiquer le membre dont vous voulez voir le profil : /profil membre`,
            type: 'USER',
            required: false,  
        },
        {
            name: 'signature',
            description: `La nouvelle signature ne peut pas dépasser 300 caractères.`,
            type: 'STRING',
            required: false,  
        },
        {
            name: 'anniversary',
            description: `Veuillez saisir la date sous la forme JJ/MM. Exemple : 01/12, 23/02`,
            type: 'STRING',
            required: false,
        },
        {
            name: 'pm',
            description: `Veuillez saisir seulement : open = ouverts, ask = sur demande, no = fermés`,
            type: 'STRING',
            required: false,  
        },
    ],
    async runInteraction(client, interaction) {

        if (interaction.options.getUser('member')) {
            const mentionUser = interaction.options.getUser('member')
            const mentionProfileData = await Profile.findOne({ userId: mentionUser.id, guildId: interaction.guild.id });

            if (!mentionProfileData) return interaction.reply({content: `Je suis désolé, Miyazaki n'a pas trouvé le profile de ${mentionUser}... Il se peut qu'il n'en ait pas encore.`, ephemeral: true});
    
            const themeData = await Theme.findOne({ themeName: mentionProfileData.profile.theme.usedTheme })
            const expToLevelUp = ( mentionProfileData.level.level > 34 ? (mentionProfileData.level.level + 1) * 3000 : (mentionProfileData.level.level + 1) * 1000 );

            const expBar = (
                mentionProfileData.level.experience / expToLevelUp * 100  < 10 ?
                (`⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 20 ?
                (`🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 30 ?
                (`🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 40 ?
                (`🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 50 ?
                (`🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 60 ?
                (`🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 70 ?
                (`🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 80 ?
                (`🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛`) :
                mentionProfileData.level.experience / expToLevelUp * 100 < 90 ?
                (`🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛`) : (`🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦`)
            );
    
            const embed = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Profil de ${mentionUser.nickname || mentionUser.username} (${mentionUser.tag})`)
            .setThumbnail(mentionUser.displayAvatarURL())
            .setDescription(`${mentionProfileData.profile.signature}`)
            .setColor(`${themeData.themeColor}`)
            embed.addFields(
                {
                    name: `${themeData.themeEmote} Date d'anniversaire`, value: `${mentionProfileData.profile.birthday.month == 0 ? `Date d'anniversaire non définie.` : `${mentionProfileData.profile.birthday.day}/${mentionProfileData.profile.birthday.month}`}`, inline: true
                },
                {
                    name: `${themeData.themeEmote} Messages privés`, value: `${mentionProfileData.profile.mp == 0 ? `🟩 Ouverts` : mentionProfileData.profile.mp == 1 ? `🟧 Sur demande` : `🟥 fermés`}`, inline : true
                }
            )

            const lb = await Profile.find({ guildId: interaction.guild.id }).sort({ "economy.coins": - 1 });

            for (let a = 0; a < lb.length; a++) {
                const you = await interaction.guild.members.fetch(lb[a].userId) == mentionUser.id ? a + 1 : null

                if (you) {
                    embed.addFields({name :`${themeData.themeEmote} Fragments polaires`, value:`Fragments polaires : ${mentionProfileData.economy.coins} — Son classement : ${you}`})
                }
            }
            embed.addField(`${themeData.themeEmote} Niveau ${mentionProfileData.level.level}`, `${expBar}⬆️ (${mentionProfileData.level.experience}/${expToLevelUp})`)
            embed.setTimestamp()
            embed.setImage(`${themeData.themeImage}`)
            embed.setFooter({ text: `Thème : ${themeData.themeName}` });
    
            interaction.reply({ embeds : [embed] });
        } else if (interaction.options.getString('signature')) {
            const profileData = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guild.id })
            const newSignature = interaction.options.getString('signature')

            if (newSignature.length < 300) {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                                'profile.signature': newSignature,
                        }
                }).then(interaction.reply({ content: `Miyazaki a changé ta signature avec succès : ${profileData.profile.signature} => ${newSignature}`, ephemeral: true}))

            } else return interaction.reply( { content: `Ta signature dépasse 300 caractères... Miyazaki n'arrive pas à tout noter...`, ephemeral: true} )

        } else if (interaction.options.getString('pm')) {

            if (interaction.options.getString('pm') == "open") {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                                'profile.mp': 0,
                            }
                }).then(interaction.reply({ content: `Miyazaki a changé le statut de tes messages privés avec succès !`, ephemeral: true}))
            } else if (interaction.options.getString('pm') == "no") {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                                'profile.mp': 2,
                            }
                }).then(interaction.reply({ content: `Miyazaki a changé le statut de tes messages privés avec succès !`, ephemeral: true}))
            } else if (interaction.options.getString('pm') == "ask") {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                                'profile.mp': 1,
                            }
                }).then(interaction.reply({ content: `Miyazaki a changé le statut de tes messages privés avec succès !`, ephemeral: true}))
            } else {
                interaction.reply({ content: `Miyazaki n'a pas compris si tu voulais tes messages privés fermés ou ouverts... Voici ce que tu m'as demandé si ça peut t'aider : ${interaction.options.getString('pm')}`, ephemeral: true })
            }

        } else if (interaction.options.getString('anniversary')) {
            const profileData = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

            if (profileData.profile.birthday.month != 0) return interaction.reply({content: `Tu m'as déjà dit ta date d'anniversaire non ?`, ephemeral: true})

            if (interaction.options.getString('anniversary').length == 5) {
                const dates = interaction.options.getString('anniversary').includes('/') ? interaction.options.getString('anniversary').split('/') : null

                if (dates == null) return interaction.reply({ content : `Je crois que tu n'as pas saisi une date correcte... Tu as peut-être oublié le "/".`, ephemeral: true});

                const intDay = parseInt(dates[0])
                const intMonth = parseInt(dates[1])

                if (isNaN(intDay) == true || isNaN(intMonth) == true ) return interaction.reply({ content : `Je crois que tu n'as pas saisi une date correcte... Les valeurs doivent être des nombres.`, ephemeral: true});

                if (intDay > 31 || intMonth > 12 || intDay < 1 || intMonth < 1) return interaction.reply({ content : `Je crois que tu n'as pas saisi une date correcte... Tu as peut-être saisi des dates qui n'existent pas, comme par exemple le 30 février. Qui est né le 30 février ?`, ephemeral: true});

                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                            'profile.birthday.day': intDay,
                            'profile.birthday.month': intMonth,
                            }
                }).then(interaction.reply({ content: `Miyazaki a retenu ta date d'anniversaire ! Fêtons-la ensemble le jour J !`, ephemeral: true}))
            } else interaction.reply({ content : `Je crois que tu n'as pas saisi une date correcte... Il y a peut-être trop de caractères.`, ephemeral: true})

        } else if (interaction.options.getString() == null) {
            const profileData = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guild.id })
            const themeData = await Theme.findOne({ themeName: profileData.profile.theme.usedTheme })
            const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );

            const expBar = (
                profileData.level.experience / expToLevelUp * 100  < 10 ?
                (`⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 20 ?
                (`🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 30 ?
                (`🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 40 ?
                (`🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 50 ?
                (`🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 60 ?
                (`🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 70 ?
                (`🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 80 ?
                (`🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛`) :
                profileData.level.experience / expToLevelUp * 100 < 90 ?
                (`🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛`) : (`🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦`)
            );
    
            const embed = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Profil de ${interaction.member.nickname || interaction.user.username} (${interaction.user.tag})`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(`${profileData.profile.signature}`)
            .setColor(`${themeData.themeColor}`)

            const lb = await Profile.find({ guildId: interaction.guild.id }).sort({ "economy.coins": - 1 });

            embed.addFields(
                {
                    name: `${themeData.themeEmote} Date d'anniversaire`, value: `${profileData.profile.birthday.month == 0 ? `Date d'anniversaire non définie.` : `${profileData.profile.birthday.day}/${profileData.profile.birthday.month}`}`, inline: true
                },
                {
                    name: `${themeData.themeEmote} Messages privés`, value: `${profileData.profile.mp == 0 ? `🟩 Ouverts` : profileData.profile.mp == 1 ? `🟧 Sur demande` : `🟥 fermés`}`, inline : true
                },
                {name :`${themeData.themeEmote} Fragments polaires`, value:`🌠 ${profileData.economy.coins}`}
            )
            embed.addField(`${themeData.themeEmote} Niveau ${profileData.level.level}`, `${expBar}⬆️ (${profileData.level.experience}/${expToLevelUp})`)
            embed.setTimestamp()
            embed.setImage(`${themeData.themeImage}`)
            embed.setFooter({ text: `Thème : ${themeData.themeName}` });
    
            interaction.reply({ embeds : [embed] });
        }
    }
}