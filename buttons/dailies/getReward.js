const { Profile } = require('../../models/index');

module.exports = {
    name: "getReward",
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id, guildId: interaction.guild.id});

        if (profileData.quests.dailies.reward == 1) return interaction.reply({content: `Vous avez déjà récupéré vos récompenses de missions quotidiennes aujourd'hui. Revenez demain pour de nouveau effectuer les missions quotidiennes !`, ephemeral: true})

        if (profileData.quests.dailies.reward == 0) {
            await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                '$set' : {
                    'economy.coins' : profileData.economy.coins + 60000
                }
            });
    
            const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );

            if ( profileData.level.experience + 750 >=  expToLevelUp) {
                await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                    '$set' : {
                        'level.level' : profileData.level.level + 1,
                        'level.experience': profileData.level.experience - expToLevelUp + 750
                    }
                });
            } else {
                await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                    '$set' : {
                        'level.experience' : profileData.level.experience + 750
                    }
                });
            }

            await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                '$set' : {
                    'quests.dailies.reward' : 1
                }
            });
    
            for (let a = 0; a < profileData.inventory.length; a++) {
                const item = profileData.inventory[a].name == "Jeton du Casino Belladone"
    
                if (item) {
                    await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                        '$set' : {
                            [`inventory.${a}.quantity`] : profileData.inventory[a].quantity + 1
                        }
                    });
                    return interaction.reply({content: `Vous avez reçu vos récompenses de missions quotidiennes ! Revenez demain pour encore récupérer les récompenses de missions quotidiennes.`, ephemeral: true})
                }
            };

            await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                '$push' : {
                    inventory : { name: "Jeton du Casino Belladone", quantity: 1, category: "Objets échangeables", itemEmote: "🪙" }
                }
            });

            return interaction.reply({content: `Vous avez reçu vos récompenses de missions quotidiennes ! Revenez demain pour encore récupérer les récompenses de missions quotidiennes.`, ephemeral: true});
        }
        
    }
}