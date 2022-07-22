const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-récompenses",
    async runInteraction(client, interaction) {
        const thread = interaction.channel
        const profileData = await Profile.findOne({userId: interaction.user.id});
        const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme});
        const questData = await Quest.findOne({userId: interaction.user.id});

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        if (!profileData.friendship) {
            await Profile.updateOne({ userId: interaction.user.id }, {
                '$set': {
                    'friendship.belladone': 0
                }
            })
        } 
        
        if (profileData.friendship.belladone < 100) {
            await Profile.updateOne({ userId: interaction.user.id }, {
                '$set': {
                    'economy.coins': profileData.economy.coins + 100000,
                    'friendship.belladone': profileData.friendship.belladone + 1
                }
            });

            if (profileData.friendship.belladone + 1 == 100) {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$push': {
                        'profile.theme.allThemes': ['Atropa Belladonna — Thème de Belladone']
                    }
                });
            }
        }

        await Profile.updateOne({ userId: interaction.user.id }, {
            '$set': {
                'economy.coins': profileData.economy.coins + 100000,
            }
        });

        await Quest.updateOne({ userId: interaction.user.id }, {
            '$set': {
                'dailies.event': questData.dailies.event + 1,
            }
        });

        var i = 0

        for (let a = 0; a < profileData.inventory.length; a++) {
            const item = await profileData.inventory[a].name == "Jeton du Casino Belladone"

            if (item && a < profileData.inventory.length) {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                        [`inventory.${a}.quantity`] : profileData.inventory[a].quantity + 10
                    }
                });

                i = a
            } else {
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$push' : {
                        inventory : { name: "Jeton du Casino Belladone", quantity: 10, category: "Objets échangeables" }
                    }
                });

                i = undefined
            }
        }

        const embed = new MessageEmbed()
        .setTitle(`Récompenses d'événement aléatoire`)
        .addFields(
            {
                name: `${themeData.themeEmote} Affinité avec Belladone :`, value: `${profileData.friendship.belladone} ➡️ ${profileData.friendship.belladone + 1} \n (${profileData.friendship.belladone < 100 ? `${100- 1 - profileData.friendship.belladone} points avant obtention du thème : Atropa Belladonna — Thème de Belladone` : `Thème obtenu : Atropa Belladonna — Thème de Belladone`})`, inline: true
            },
            {
                name: `${themeData.themeEmote} 100000 fragments polaires :`, value: `${profileData.economy.coins} ➡️ ${profileData.economy.coins + 100000}`, inline: true
            },
            {
                name: `${themeData.themeEmote} 10 jetons du Casino Belladone :`, value: `${i != undefined ? profileData.inventory[i].quantity : "0"} ➡️ ${i != undefined ? profileData.inventory[i].quantity + 10 : "10"}`, inline: true
            }
        )
        .setColor(`${themeData.themeColor}`)
        .setFooter({text: `🔁 Le fil sera automatiquement supprimé dans 5 minutes`})

        interaction.reply({embeds: [embed]})
    }
}
