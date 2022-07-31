const { Profile, Theme } = require('../../models/index');
var CronJob = require('cron').CronJob;
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Miyazaki est prêt !');

        client.user.setPresence({
            status: "idle", 
            activities: [{ name: 'aider tous les membres du Radiant Realm' }],
            type: 'WATCHING'
        });

        var pick = new CronJob(
            '*/10 * * * *',
            async function() {
                const customMessage = [
                    "Waouh, Regarde ! il y'a **🌠 10000 fragments polaires** par terre ! Vite, ramasse les !",
                    "Oh c'est moi où il y'a **🌠 10000 fragments polaires** là ? On a vraiment de la chance aujourd'hui ! Héhé, on va les prendre, ça dérangera personne de toute façon !",
                    "Hé, des **🌠 fragments polaires** par terre ! Il y'en a... attend je compte... Waouh, **10000** ! Quand on verra Jean on pourra les échanger contre de l'argent !",
                ]

                var customMessageSelect = Math.floor(Math.random() * customMessage.length)

                const embed = new MessageEmbed()
                .setTitle(`Miyazaki — Super Guide`)
                .setDescription(customMessage[customMessageSelect])
                .setFooter({ text: `📩 Récupérez les fragments polaires` })
                .setColor(`FFFFFF`)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL())

                const button = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('pick-1')
                                .setLabel('📩 Récupérer les fragments polaires')
                                .setStyle('SUCCESS')
                        );
                
                client.channels.fetch('912009027125407894').then(channel => {
                    channel.send({ embeds: [ embed ], components: [button] }).then(message => setTimeout(() => message.delete(), 60000));
                });
            },
            null,
            true,
            'Europe/Paris'
        )

        var resetDailies = new CronJob(
            '0 0 0 * * *',
            async function() {
                await Profile.updateMany({}, {
                    '$set' : {
                        'quests.dailies.messages' : 0,
                        'quests.dailies.mentions' : 0,
                        'quests.dailies.event': 0,
                        'quests.dailies.commission': 0,
                        'quests.dailies.reward': 0,
                        'profile.gifts': []
                    }
                });
            },
            null,
            true,
            'Europe/Paris'
        );

        var birthday = new CronJob(
            '0 0 0 * * *',
            async function() {
                const day = dayjs().date()
                const month = dayjs().month() + 1
                const birthdayUser = await Profile.find({ 'profile.birthday.day': day, 'profile.birthday.month': month, guildId: '769191265756512294' });

                for (let a = 0; a < birthdayUser.length; a++) {
                    const member = await client.users.fetch(birthdayUser[a].userId).catch(console.error);
        
                    const embed = new MessageEmbed()
                    .setTitle(`🎉 Joyeux anniversaire, ${member.nickname || member.username} !!! 🎉`)
                    .setDescription(`Waouh, j'arrive pas à croire que c'est déjà ton anniversaire ! Pour l'occasion, je t'ai préparé des cadeaux, ouvre les vite ! ✨\n\n Et si non allait à la rencontre de nos amis ? Si ça se trouve, ils vont nous donner des cadeaux !!! Hem, hem, je veux dire te donner des cadeaux. ✨`)
                    .setColor('FFFFFF')
                    .setThumbnail(member.displayAvatarURL())
                    .setFields(
                        { name: `📩 Vos cadeaux d'anniversaire`, value: `🎂 Un beau gâteau préparé avec soin, 🌠 200000 fragments polaires` }
                    )
                    .setFooter({ text: `📩 Réception automatique des cadeaux d'anniversaire` });

                    await Profile.updateOne({ userId: birthdayUser[a].userId, guildId: '769191265756512294' }, {
                        '$set': {
                            'economy.coins': birthdayUser[a].economy.coins + 200000
                        }
                    });

                    const item = birthdayUser[a].inventory.find(item => item.name == `Gâteau d'anniversaire`);
                    const itemIndex = birthdayUser[a].inventory.indexOf(item);

                    if (itemIndex != -1) {
                        await Profile.updateOne({ userId: birthdayUser[a].userId, guildId: '769191265756512294' }, {
                            '$set': {
                                [`inventory.${itemIndex}.quantity`]: birthdayUser[a].inventory[itemIndex].quantity + 1
                            }
                        });
                    } else {
                        await Profile.updateOne({ userId: birthdayUser[a].userId, guildId: '769191265756512294' }, {
                            '$push': {
                                'inventory': { name: "Gâteau d'anniversaire", quantity: 1, category: "Collectionnables", itemEmote:"🎂"}
                            }
                        });
                    }

                    client.channels.fetch('770628068632559628').then(channel => {
                        channel.send({content: `||<@&789141086085578784>||`, embeds: [ embed ] }).then(message => {
                            message.react('🎂')
                            message.react('🎉')
                            message.react('🎊')
                        });
                    });
                };
            },
            null,
            true,
            'Europe/Paris'
        )
        

        const devGuild = await client.guilds.cache.get('994929200102387812');
        devGuild.commands.set(client.commands.map(command => command));
    },
};