const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-récompenses",
    async runInteraction(client, interaction) {
        const thread = interaction.channel
        const profileData = await Profile.findOne({userId: interaction.user.id, guildId: interaction.guild.id});
        const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme});

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        if (!profileData.friendship.belladone) {
            await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                '$set': {
                    'friendship.belladone': 1
                }
            })
        } 
        
        if (profileData.friendship.belladone < 100) {
            await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                '$set': {
                    'friendship.belladone': profileData.friendship.belladone + 1
                }
            });

            if (profileData.friendship.belladone + 1 == 100) {
                await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                    '$push': {
                        'profile.theme.allThemes': ['Atropa Belladonna — Thème de Belladone']
                    }
                });
            }
        }

        await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
            '$set': {
                'economy.coins': profileData.economy.coins + 100000,
            }
        });

        await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
            '$set': {
                'quests.dailies.event': profileData.quests.dailies.event + 1,
            }
        });

        const embed = new MessageEmbed()
        .setTitle(`Récompenses d'événement aléatoire`)
        .addFields(
            {
                name: `${themeData.themeEmote} Affinité avec Belladone :`, value: `${profileData.friendship.belladone} ➡️ ${profileData.friendship.belladone + 1} \n (${profileData.friendship.belladone < 100 ? `${100- 1 - profileData.friendship.belladone} points avant obtention du thème : Atropa Belladonna — Thème de Belladone` : `Thème obtenu : Atropa Belladonna — Thème de Belladone`})`, inline: true
            },
            {
                name: `${themeData.themeEmote} 100000 fragments polaires :`, value: `${profileData.economy.coins} ➡️ ${profileData.economy.coins + 100000}`, inline: true
            }
        )
        .setColor(`${themeData.themeColor}`)
        .setFooter({text: `🔁 Le fil sera automatiquement supprimé dans 5 minutes`})

        for (let a = 0; a < profileData.inventory.length || profileData.inventory.length == 0; a++) {
            const item = await profileData.inventory[a] == undefined ? false : profileData.inventory[a].name == "Jeton du Casino Belladone" ? true : false

            if (item == true) {
                await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                    '$set' : {
                        [`inventory.${a}.quantity`] : profileData.inventory[a].quantity + 10
                    }
                });

                embed.addFields({ name: `${themeData.themeEmote} 10 jetons du Casino Belladone :`, value: `${profileData.inventory[a].quantity} ➡️ ${profileData.inventory[a].quantity + 10}`, inline: true })

                return interaction.reply({embeds: [embed]});

            } else if (a == profileData.inventory.length) {

                await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                    '$push' : {
                        'inventory' : { name: "Jeton du Casino Belladone", quantity: 10, category: "Objets échangeables", itemEmote:"🪙"}
                    }
                });

                embed.addFields({ name: `${themeData.themeEmote} 10 jetons du Casino Belladone :`, value: `0 ➡️ 10`, inline: true })

                return interaction.reply({embeds: [embed]});
            }
        }
    }
}
