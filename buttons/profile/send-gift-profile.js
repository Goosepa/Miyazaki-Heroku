const { Profile, Theme, Guild } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
    name: "send-gift-profile",
    async runInteraction(client, interaction, message) {
        const guild = await Guild.findOne({ id: interaction.guild.id }).catch(console.error);
        const interactionId = await guild.profileData.find(x => x.interactionMessageId === interaction.message.id);

        if (interactionId.mentionMember === interaction.user.id) return interaction.reply({ content: `❌ Vous ne pouvez pas vous envoyer de cadeau.`, ephemeral: true });

        if (interactionId) {
            const mentionUser = await client.users.fetch(interactionId.mentionMember);
            const mentionMemberProfileData = await Profile.findOne({ userId: interactionId.mentionMember });
            
            if (mentionMemberProfileData.profile.gifts.includes(interaction.user.id)) {
                return interaction.reply({ content: `❌ Vous avez déjà envoyé un cadeau à cette personne aujourd'hui.`, ephemeral: true })
            } else {
                await Profile.updateOne({ userId: mentionUser.id, guildId: interaction.guild.id }, {
                    '$push': {
                        'profile.gifts': interaction.user.id
                    }
                });

                const gifts = [ '🪙 5 jetons du Casino Belladone', '🌠 60000 fragments polaires' ]

                var whichGift = Math.floor(Math.random() * gifts.length);
                    
                if (gifts[whichGift] === '🪙 5 jetons du Casino Belladone') {
                    const item = mentionMemberProfileData.inventory.find(item => item.name == `Jeton du Casino Belladone`);
                    const itemIndex = mentionMemberProfileData.inventory.indexOf(item);

                    if (itemIndex != -1) {
                        console.log('Ok')
                        await Profile.updateOne({ userId: mentionUser.id, guildId: interaction.guild.id }, {
                            '$set' : {
                                [`inventory.${itemIndex}.quantity`] : mentionMemberProfileData.inventory[itemIndex].quantity + 5
                            }
                        });
                    } else {
                        console.log('Pas ok')
                        await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                            '$push' : {
                                'inventory' : { name: "Jeton du Casino Belladone", quantity: 5, category: "Objets échangeables", itemEmote:"🪙"}
                            }
                        });
                    }

                    const embed = new MessageEmbed()
                    .setTitle(`🎁 Waouh, tu as reçu un cadeau !`)
                    .setDescription(`C'est un cadeau de la part du membre ${interaction.member.nickname || interaction.user.username} ! Ouvre le vite !`)
                    .setFooter({ text: `🔁 Réception automatique du cadeau.` })
                    .setColor('FFFFFF')
                    .addFields(
                        { name: `📩 Contenu du cadeau`, value: `${gifts[whichGift]}` }
                    )
                    .setTimestamp()
                    .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1002185148265140334/inventory.png?width=671&height=671')

                    interaction.reply({ content: `🎁 Vous avez envoyé ${gifts[whichGift]} à ${mentionUser}. ℹ️ Les cadeaux ne peuvent être envoyés qu'une fois par jour, à plusieurs personnes et ne sont pas déduits des objets de votre inventaire.`, ephemeral: true })

                    return client.channels.fetch('770628068632559628').then(channel => {
                        channel.send({content: `${mentionUser}`, embeds: [ embed ] }).then(message => {
                            message.react('🎁')
                        });
                    });

                } else if (gifts[whichGift] === '🌠 60000 fragments polaires') {
                    await Profile.updateOne({ userId: mentionUser.id, guildId: interaction.guild.id }, {
                        '$set' : {
                            'economy.coins' : mentionMemberProfileData.economy.coins + 60000
                        }
                    });

                    const embed = new MessageEmbed()
                    .setTitle(`🎁 Waouh, tu as reçu un cadeau !`)
                    .setDescription(`C'est un cadeau de la part du membre ${interaction.member} ! Ouvre le vite !`)
                    .setFooter({ text: `🔁 Réception automatique du cadeau.` })
                    .addFields(
                        { name: `📩 Contenu du cadeau`, value: `${gifts[whichGift]}` }
                    )
                    .setColor('FFFFFF')
                    .setTimestamp()
                    .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1002185148265140334/inventory.png?width=671&height=671')

                    interaction.reply({ content: `🎁 Vous avez envoyé ${gifts[whichGift]} à ${mentionUser}. ℹ️ Les cadeaux ne peuvent être envoyés qu'une fois par jour, à plusieurs personnes et ne sont pas déduits des objets de votre inventaire.`, ephemeral: true })

                    return client.channels.fetch('770628068632559628').then(channel => {
                        channel.send({content: `${mentionUser}`, embeds: [ embed ] }).then(message => {
                            message.react('🎁')
                        });
                    });
                }

                const themeData = await Theme.findOne({ themeName: mentionMemberProfileData.profile.theme.usedTheme })
                const expToLevelUp = ( mentionMemberProfileData.level.level > 34 ? (mentionMemberProfileData.level.level + 1) * 3000 : (mentionMemberProfileData.level.level + 1) * 1000 );

                const expBar = (
                    mentionMemberProfileData.level.experience / expToLevelUp * 100  < 10 ?
                    (`⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 20 ?
                    (`🟦⬛⬛⬛⬛⬛⬛⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 30 ?
                    (`🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 40 ?
                    (`🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 50 ?
                    (`🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 60 ?
                    (`🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 70 ?
                    (`🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 80 ?
                    (`🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛`) :
                    mentionMemberProfileData.level.experience / expToLevelUp * 100 < 90 ?
                    (`🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛`) : (`🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦`)
                );

                const embed = new MessageEmbed()
                .setTitle(`${themeData.themeEmote} Profil de ${mentionUser.nickname || mentionUser.username} (${mentionUser.tag})`)
                .setThumbnail(mentionUser.displayAvatarURL())
                .setDescription(`${mentionMemberProfileData.profile.signature}`)
                .setColor(`${themeData.themeColor}`)
                .addFields(
                    {
                        name: `${themeData.themeEmote} Date d'anniversaire`, value: `🎂  ${mentionMemberProfileData.profile.birthday.month == 0 ? `Date d'anniversaire non définie.` : `${mentionMemberProfileData.profile.birthday.day}/${mentionMemberProfileData.profile.birthday.month}`}`, inline: true
                    },
                    {
                        name: `${themeData.themeEmote} Messages privés`, value: `${mentionMemberProfileData.profile.mp == 0 ? `🟩 Ouverts` : mentionMemberProfileData.profile.mp == 1 ? `🟧 Sur     demande` : `🟥 fermés`}`, inline : true
                    },
                    {name :`${themeData.themeEmote} Fragments polaires`, value:`🌠 ${mentionMemberProfileData.economy.coins}`, inline: true},
                    {name :`${themeData.themeEmote} Nombre de personnes ayant aimé le profil`, value:`👍 ${mentionMemberProfileData.profile.likes.length}`, inline: true},
                    {name :`${themeData.themeEmote} Nombre de cadeaux reçus aujourd'hui`, value:`🎁 ${mentionMemberProfileData.profile.gifts.length + 1}`, inline: true},
                )
                .addField(`${themeData.themeEmote} Niveau ${mentionMemberProfileData.level.level}`, `${expBar}⬆️ (${mentionMemberProfileData.level.experience}/${expToLevelUp})`)
                .setTimestamp()
                .setImage(`${themeData.themeImage}`)
                .setFooter({ text: `Thème : ${themeData.themeName}` });

                return interaction.channel.messages.fetch(interactionId.interactionMessageId)
                .then(message => message.edit({ embeds: [embed]}).then(interaction.reply({ content: `Vous avez envoyé un cadeau à ${mentionUser}.`, ephemeral: true })));
            }
        } else return interaction.reply({ content: `Oups, une erreur s'est produite lors de l'intéraction. Veuillez réessayer en renvoyant la commande !`, ephemeral: true });
    }
}