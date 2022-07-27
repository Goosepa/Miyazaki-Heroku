const { Profile, Theme } = require('../../models/index');
var CronJob = require('cron').CronJob;
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

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
                    "Waouh, Regarde ! il y'a **🌠 10000 fragments polaires** par terre ! Vite, ramasse les, on pourra les échanger contre de l'argent quand on verra Jean !",
                    "Oh c'est moi où il y'a **🌠 10000 fragments polaires** là ? On a vraiment de la chance aujourd'hui ! Héhé, on va les prendre, ça dérangera personne de toute façon !",
                    "Hé, des **🌠 fragments polaires** par terre ! Il y'en a... attend je compte... Waouh, **10000** ! Quand on verra Jean on pourra les échanger contre de l'argent !",
                ]

                var customMessageSelect = Math.floor(Math.random() * customMessage.length)

                const embed = new MessageEmbed()
                .setTitle(customMessage[customMessageSelect])
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
                const cutomMessage = [ `Et si on rendait visite à Belladone aujourd'hui ? On pourra lui apporter des gâteaux en passant !`, `Ryle n'avait pas dit qu'il avait besoin de nous pour quelque chose ? Bon, vu comment il est, je pense qu'il veut surtout nous refiler son boulot.`, `Tu penses que Ryle et Jean sont au salon de thé aujourd'hui ? Si ça se trouve y'aura même Belladone.` ]
        
                var customMessageSelect = Math.floor(Math.random() * cutomMessage.length)
        
                const embed = new MessageEmbed()
                .setTitle(`✨ Les quêtes quotidiennes ont été réinitialisées ✨`)
                .setDescription(`${cutomMessage[customMessageSelect]}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(`FFFFFF`)
                .setTimestamp()
                await Profile.updateOne({userId: "638436496596008972"}, {
                    '$set' : {
                        'quests.dailies.messages' : 0,
                        'quests.dailies.mentions' : 0,
                        'quests.dailies.event': 0,
                        'quests.dailies.commission': 0,
                        'quests.dailies.reward': 0
                    }
                });
                client.channels.fetch('802070130837291029').then(channel => {
                    channel.send({ embeds: [ embed ] }).then(message => message.react('✅'));
                });
            },
            null,
            true,
            'Europe/Paris'
        );
        

        const devGuild = await client.guilds.cache.get('994929200102387812');
        devGuild.commands.set(client.commands.map(command => command));
    },
};