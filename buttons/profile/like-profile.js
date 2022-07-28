const { Profile, Theme, Guild } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');


module.exports = {
    name: "like-profile",
    async runInteraction(client, interaction, message) {
        const guild = await Guild.findOne({ id: interaction.guild.id }).catch(console.error);
        const interactionId = await guild.profileData.find(x => x.interactionMessageId === interaction.message.id);

        if (interactionId.mentionMember === interaction.user.id) return interaction.reply({ content: `❌ Vous ne pouvez pas aimer votre propre profil.`, ephemeral: true });

        if (interactionId) {
            const mentionUser = await client.users.fetch(interactionId.mentionMember);
            const mentionMemberProfileData = await Profile.findOne({ userId: interactionId.mentionMember });
            
            if (mentionMemberProfileData.profile.likes.includes(interaction.user.id)) {
                await Profile.updateOne({ userId: mentionUser.id, guildId: interaction.guild.id }, {
                    '$pull': {
                        'profile.likes': interaction.user.id
                    }
                });

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
                    {name :`${themeData.themeEmote} Nombre de personnes ayant aimé le profil`, value:`👍 ${mentionMemberProfileData.profile.likes.length - 1 === 0 ? `Encore personne n'a aimé ce profil.` : mentionMemberProfileData.profile.likes.length - 1}`, inline: true},
                    {name :`${themeData.themeEmote} Nombre de cadeaux reçus aujourd'hui`, value:`🎁 ${mentionMemberProfileData.profile.gifts.length === 0 ? `Encore aucun cadeau reçu aujourd'hui.` : mentionMemberProfileData.profile.gifts.length}`, inline: true},
                )
                .addField(`${themeData.themeEmote} Niveau ${mentionMemberProfileData.level.level}`, `${expBar}⬆️ (${mentionMemberProfileData.level.experience}/${expToLevelUp})`)
                .setTimestamp()
                .setImage(`${themeData.themeImage}`)
                .setFooter({ text: `Thème : ${themeData.themeName}` });

                return interaction.channel.messages.fetch(interactionId.interactionMessageId)
                .then(message => message.edit({ embeds: [embed]}).then(interaction.reply({ content: `Vous n'aimez plus le profil de ${mentionUser}.`, ephemeral: true })));
            } else {
                await Profile.updateOne({ userId: mentionUser.id, guildId: interaction.guild.id }, {
                    '$push': {
                        'profile.likes': interaction.user.id
                    }
                });

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
                    {name :`${themeData.themeEmote} Nombre de personnes ayant aimé le profil`, value:`👍 ${mentionMemberProfileData.profile.likes.length + 1}`, inline: true},
                    {name :`${themeData.themeEmote} Nombre de cadeaux reçus aujourd'hui`, value:`🎁 ${mentionMemberProfileData.profile.gifts.length === 0 ? `Encore aucun cadeau reçu aujourd'hui.` : mentionMemberProfileData.profile.gifts.length}`, inline: true},
                )
                .addField(`${themeData.themeEmote} Niveau ${mentionMemberProfileData.level.level}`, `${expBar}⬆️ (${mentionMemberProfileData.level.experience}/${expToLevelUp})`)
                .setTimestamp()
                .setImage(`${themeData.themeImage}`)
                .setFooter({ text: `Thème : ${themeData.themeName}` });

                return interaction.channel.messages.fetch(interactionId.interactionMessageId)
                .then(message => message.edit({ embeds: [embed]}).then(interaction.reply({ content: `Vous avez aimé le profil de ${mentionUser}.`, ephemeral: true })));
            }
        } else return interaction.reply({ content: `Oups, une erreur s'est produite lors de l'intéraction. Veuillez réessayer en renvoyant la commande !`, ephemeral: true });
    }
}