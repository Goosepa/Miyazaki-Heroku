const { MessageEmbed, Formatters } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, member) {
        const fetchGuild = await client.getGuild(member.guild);
        const fetchedLogs1 = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const fetchedLogs2 = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const kickLog = fetchedLogs1.entries.first()
        const banLog = fetchedLogs2.entries.first()

        if (kickLog.target.id === member.user.id && kickLog.createdAt > member.joinedAt) {
            const embed = new MessageEmbed()
            .setAuthor( { name: `${ member.user.tag } (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor('#DC143C')
            .setTitle(`Un membre vient de se faire expulser du serveur...`)
            .setDescription(`Bye bye ${member.displayName}, je souhaite que tu as tout de même passé un bon moment ici...`)
            .addFields( 
                {
                    name: `Compte créé le :`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`, inline: true
                },
                {
                    name: `Rejoint le :`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`, inline: true
                },
                {
                    name: `Quitté le :`, value: `<t:${parseInt(Date.now() / 1000)}:f> (<t:${parseInt(Date.now() / 1000)}:R>)`, inline: true
                },
                {
                    name: `Raison de l'expulsion :`, value: `${kickLog.reason || `Pas de raison précisée.`}`, inline: true
                }
            )
            .setThumbnail( member.user.displayAvatarURL())
            .setTimestamp()

            const byeChannel = client.channels.cache.get(fetchGuild.byeChannel);
            byeChannel.send({ embeds: [embed] });

        } else if (banLog.target.id === member.user.id && banLog.createdAt > member.joinedAt) {
            const embed = new MessageEmbed()
            .setAuthor( { name: `${ member.user.tag } (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor('#DC143C')
            .setTitle(`Un membre vient de se faire bannir du serveur.`)
            .setDescription(`Bye bye ${member.displayName}, je souhaite que tu ne reviendras plus jamais ici.`)
            .addFields( 
                {
                    name: `Compte créé le :`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`, inline: true
                },
                {
                    name: `Rejoint le :`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`, inline: true
                },
                {
                    name: `Quitté le :`, value: `<t:${parseInt(Date.now() / 1000)}:f> (<t:${parseInt(Date.now() / 1000)}:R>)`, inline: true
                },
                {
                    name: `Raison du bannissement :`, value: `${banLog.reason || `Pas de raison précisée.`}`, inline: true
                }
                
            )
            .setThumbnail( member.user.displayAvatarURL())
            .setTimestamp()

            const byeChannel = client.channels.cache.get(fetchGuild.byeChannel);
            byeChannel.send({ embeds: [embed] });

        } else {
            const embed = new MessageEmbed()
            .setAuthor( { name: `${ member.user.tag } (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor('#FFFFFF')
            .setTitle(`Un membre vient de quitter le Radiant Realm...`)
            .setDescription(`Bye bye ${member.displayName}, je souhaite que tu as tout de même passé un bon moment ici...`)
            .addFields( 
                {
                    name: `Compte créé le :`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`, inline: true
                },
                {
                    name: `Rejoint le :`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`, inline: true
                },
                {
                    name: `Quitté le :`, value: `<t:${parseInt(Date.now() / 1000)}:f> (<t:${parseInt(Date.now() / 1000)}:R>)`, inline: true
                }
            )
            .setThumbnail( member.user.displayAvatarURL())
            .setTimestamp()

            const byeChannel = client.channels.cache.get(fetchGuild.byeChannel);
            byeChannel.send({ embeds: [embed] });
        }
    },
};
