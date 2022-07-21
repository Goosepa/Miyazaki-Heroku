const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed} = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "getReward",
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id});
        const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme});
        const questData = await Quest.findOne({userId: interaction.user.id});

        if (questData.dailies.reward == 1) return interaction.reply({content: `Vous avez déjà récupéré les récompenses de missions quotidiennes aujourd'hui. Revenez demain pour de nouveau effectuer les missions quotidiennes.`, ephemeral: true})

        if (questData.dailies.reward == 0) {
            await Profile.updateOne({ userId: interaction.user.id }, {
                '$set' : {
                    'economy.coins' : profileData.economy.coins + 60000
                }
            });
    
            if (profileData) {
                const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );
    
                await Profile.updateOne({ userId: interaction.user.id }, {
                    '$set' : {
                        'level.experience' : profileData.level.experience + 750
                    }
                });
    
                if (profileData.level.experience + 750 >= expToLevelUp) {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                            'level.level' : profileData.level.level + 1,
                            'level.experience': profileData.level.experience - expToLevelUp + 750
                        }
                    });
                }
            }
    
            const hour = dayjs().hour()
            const minute = dayjs().minute()
            const cooldownHour = minute > 0 ? 23 - hour : 24 - hour
            const cooldownMinute = 59 - minute
            const embed = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Vous avez reçu vos récompenses de missions quotidiennes`)
            .setDescription(`Merci d'être actif dans le Radiant Realm, veuillez attendre demain pour de nouveau effectuer les missions quotidiennes.`)
            .addField(`📩 Contenu de la récompense`, `750 points d'expérience, 60000 fragments polaires, 1 Jeton du Casino Belladone`)
            .setFooter({text: `Temps avant la réinitialisation des missions quotidiennes : ${cooldownHour}h${cooldownMinute}`})
            .setColor(`${themeData.themeColor}`)

            await Quest.updateOne({ userId: interaction.user.id }, {
                '$set' : {
                    'dailies.reward' : 1
                }
            });
    
    
            for (let a = 0; a < profileData.inventory.length; a++) {
                const item = profileData.inventory[a].name == "Jeton du Casino Belladone"
    
                if (item) {
                    await Profile.updateOne({ userId: interaction.user.id }, {
                        '$set' : {
                            [`inventory.${a}.quantity`] : profileData.inventory[a].quantity + 1
                        }
                    });
                    return interaction.reply({embeds: [embed], ephemeral: true})
                };
            }
    
            await Profile.updateOne({ userId: interaction.user.id }, {
                '$push' : {
                    inventory : { name: "Jeton du Casino Belladone", quantity: 1, category: "Objets échangeables", itemEmote: "🪙" }
                }
            });

            return interaction.reply({embeds: [embed], ephemeral: true})
        }
        
    }
}