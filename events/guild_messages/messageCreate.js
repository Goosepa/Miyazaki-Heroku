const ownerID = '638436496596008972';
const { Profile, Theme, Quest } = require('../../models/index')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { execute } = require('../random_event/Belladone1');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        if (message.guild) {
            const profileData = await Profile.findOne({ userId: message.member.user.id });
            const questData = await Quest.findOne({ userId: message.member.user.id });

            const logChannel = client.channels.cache.get('995326497520893973')

            if (!questData) {
                const createQuest = new Quest({
                    guildId: message.member.guild.id,
                    userId: message.member.user.id,
                    username: message.member.user.username,
                    dailies: {
                        messages: 0,
                        mentions: 0,
                        event: 0,
                        commission: 0,
                        date: 0,
                        reward: 0
                    },
                    randomEvent: {
                        belladone1: {'type': Number, 'default': 0}
                    }
                });
            await createQuest.save().then(p => logChannel.send(`Nouveau profil : ${p.id}`));
            }

            if (!profileData) {
                const createProfile = new Profile({
                    guildId: message.member.guild.id,
                    userId: message.member.user.id,
                    username: message.member.user.username,
                    'profile.theme.allThemes': ['Thème par défaut']
                });
        
                await createProfile.save().then(p => logChannel.send(`Nouveau profil : ${p.id}`));   
            };

//level.update1

            if (profileData) {
                const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );
    
                await Profile.updateOne({ userId: message.member.user.id }, {
                    '$set' : {
                        'level.experience' : profileData.level.experience + 100
                    }
                });
    
                if (profileData.level.experience + 100 >= expToLevelUp) {
                    await Profile.updateOne({ userId: message.member.user.id }, {
                        '$set' : {
                            'level.level' : profileData.level.level + 1,
                            'level.experience': profileData.level.experience - expToLevelUp + 100
                        }
                    });

                    message.react('⬆️')
                }
            }

//level.update1.dailymessage

            if (questData.dailies.messages || questData.dailies.messages == 0) {
                await Quest.updateOne({ userId: message.member.user.id }, {
                    '$set' : {
                                'dailies.messages': questData.dailies.messages + 1
                        }
                })

                if (questData.dailies.messages == 10) {
                    const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );
        
                    await Profile.updateOne({ userId: message.member.user.id }, {
                        '$set' : {
                            'level.experience' : profileData.level.experience + 250
                        }
                    });
        
                    if (profileData.level.experience + 250 >= expToLevelUp) {
                        await Profile.updateOne({ userId: message.member.user.id }, {
                            '$set' : {
                                'level.level' : profileData.level.level + 1,
                                'level.experience': profileData.level.experience - expToLevelUp + 250
                            }
                        })
                    }
                }
            };

//level.update1.dailymentions

            if (message.mentions.members.first()) {
                if (message.mentions.members.first() == message.member.user.id) return;

                if (questData.dailies.mentions || questData.dailies.mentions == 0) {
                    await Quest.updateOne({ userId: message.member.user.id }, {
                        '$set' : {
                                    'dailies.mentions': questData.dailies.mentions + 1
                            }
                    });
                }

                if (questData.dailies.messages == 3) {
                    const expToLevelUp = ( profileData.level.level > 34 ? (profileData.level.level + 1) * 3000 : (profileData.level.level + 1) * 1000 );
        
                    await Profile.updateOne({ userId: message.member.user.id }, {
                        '$set' : {
                            'level.experience' : profileData.level.experience + 250
                        }
                    });
        
                    if (profileData.level.experience + 250 >= expToLevelUp) {
                        await Profile.updateOne({ userId: message.member.user.id }, {
                            '$set' : {
                                'level.level' : profileData.level.level + 1,
                                'level.experience': profileData.level.experience - expToLevelUp + 250
                            }
                        })
                    }
                }
            };
        }
    },
};