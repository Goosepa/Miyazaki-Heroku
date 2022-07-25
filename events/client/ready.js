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

        var resetDailies = new CronJob(
            '0 0 0 * * *',
            async function() {
                const cutomMessage = [ `Et si on rendait visite à Belladone aujourd'hui ? On pourra lui apporter des gâteaux en passant !`, `Ryle n'avait pas dit qu'il avait besoin de nous pour quelque chose ? Bon, vu comment il est, je pense qu'il veut surtout nous refiler son boulot.`, `Tu penses que Ryle et Jean sont au salon de thé aujourd'hui ? Si ça se trouve y'aura même Belladone.`, `Yume, Las et Lina ont une évaluation aujourd'hui. Mmmmh... Je parie que Las aura 20, Lina 19.5 et Yume 3. Comme d'habitude quoi.`, `Aujourd'hui je me sens chanceux ! Je vais tenter ma chance au casino.` ]
        
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