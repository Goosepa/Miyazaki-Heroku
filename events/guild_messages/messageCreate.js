const path = require("path");
const ownerID = '638436496596008972';
const { Profile, Guild } = require('../../models/index')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const interactionCreate = require("../client/interactionCreate");
const cooldown = [ ]

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        if (message.guild) {
            const profileData = await Profile.findOne({ userId: message.member.user.id, guildId: message.guild.id });

            const logChannel = client.channels.cache.get('995326497520893973')

            if (!profileData) {
                const createProfile = new Profile({
                    guildId: message.member.guild.id,
                    userId: message.member.user.id,
                    username: message.member.user.username,
                    'profile.theme.allThemes': ['Thème par défaut']
                });
        
                await createProfile.save().then(p => logChannel.send(`Nouveau profil : ${p.id}`));   
            };

//random event

            if (!message.channel.isThread()) {
                if (message.channel.topic.includes('– Événements aléatoires : oui')) {
                    const randomEventsList = [ "belladone-1" ]

                    var event = Math.floor(Math.random() * randomEventsList.length)
                    var eventChances = Math.floor(Math.random() * 100)

                    if (eventChances < 5) {
                        if (cooldown.includes('cooldown')) {
                        } else {
                            cooldown.push('cooldown');
                            setTimeout(() => cooldown.pop(), 900000)

                            if (randomEventsList[event] == "belladone-1") {
                                const embed = new MessageEmbed()
                                .setTitle(`Belladone — Directrice du Casino Belladone`)
                                .setDescription(`Eh bien ! qu'est-ce que je vois là ? Ce ne serais pas mon cher ami/ma chère amie ? Tu as de la chance, j'ai beaucoup de temps libre        aujourd'hui (enfin comme tous les jours quoi) ! `)
                                .setColor("0e0524")
                                .setImage('https://media.discordapp.net/attachments/999092620796112946/1001538297253859419/Belladone_Happy.png?width=1342&height=671')
                                .setFooter({text: `👋 Déclencher l'événement aléatoire`})

                                const button = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('belladone1')
                                        .setLabel('👋 Salut Belladone')
                                        .setStyle('SUCCESS')
                                );

                                const messageToDelete = await message.channel.send({ embeds: [embed], components: [ button ] })
                                await setTimeout(() => messageToDelete.delete(), 300000)
                            }
                        }
                    }
                }
            }

//level.update1

            if (message.channel.isThread() || message.channel.topic.includes(`– Gain de points d'expérience : oui`)) {
                const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );
                var expToAdd = 100

                if (profileData.quests.dailies.messages < 10 || profileData.quests.dailies.messages == 0) {
                    await Profile.updateOne({ userId: message.member.user.id, guildId: message.guild.id }, {
                        '$set' : {
                            'quests.dailies.messages' : profileData.quests.dailies.messages + 1
                        }
                    });

                    if (profileData.quests.dailies.messages == 10) {
                        expToAdd = expToAdd + 250
                    }
                }

                if (message.mentions.members || profileData.quests.dailies.mentions == 0) {
                    await Profile.updateOne({ userId: message.member.user.id, guildId: message.guild.id }, {
                        '$set' : {
                            'quests.dailies.mentions' : profileData.quests.dailies.mentions + 1
                        }
                    });

                    if (profileData.quests.dailies.mentions == 3) {
                        expToAdd = expToAdd + 250
                    }
                }
    
                await Profile.updateOne({ userId: message.member.user.id, guildId: message.guild.id }, {
                    '$set' : {
                        'level.experience' : profileData.level.experience + expToAdd
                    }
                });
    
                if (profileData.level.experience + expToAdd >= expToLevelUp) {
                    await Profile.updateOne({ userId: message.member.user.id, guildId: message.guild.id }, {
                        '$set' : {
                            'level.level' : profileData.level.level + 1,
                            'level.experience': profileData.level.experience - expToLevelUp + expToAdd
                        }
                    });

                    const guild = await Guild.findOne({ id: message.guild.id })
                    const levelChannel = client.channels.cache.get(guild.levelChannel)

                    return levelChannel.send(`Félicitation ${message.member}, tu as monté au niveau ${profileData.level.level + 1} ✨`)
                };
            }
        }
    },
};