const { MessageEmbed } = require('discord.js');
const { Guild, Profile, Theme } = require('../../models/index')

module.exports = {
    name: 'leaderboard',
    category: 'users',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/leaderboard`'],
    usage: '`/leaderboard`',
    description: 'La commande `/leaderboard` permet d\'afficher le classement des 10 membres les plus riches.',
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({ userId: interaction.user.id });
        
        const lb = await Profile.find({ guildId: interaction.guild.id }).sort({ "economy.coins": - 1 });

        const lbTheme = lb[0]
        const topThemeData = await Theme.findOne({ themeName: lbTheme.profile.theme.usedTheme })

        const embed = new MessageEmbed()
        .setTitle(`${topThemeData.themeEmote} Les fortunes du Radiant Realm`)
        .setColor(`${topThemeData.themeColor}`)

        for (let a = 0; a < lb.length; a++) {
            const you = await interaction.guild.members.fetch(lb[a].userId) == interaction.user.id ? a+1 : null
            if (you !== null) {
                embed.setFooter({text: `${interaction.member.nickname || interaction.user.username} — Fragments polaires : ${profileData.economy.coins} — Votre classement : ${you}`, iconURL: interaction.user.displayAvatarURL()})
            }
        }
        for (let i = 0; i < lb.length && i < 10; i++) {
            const member = await interaction.guild.members.fetch(lb[i].userId)
            const memberData =  await Profile.findOne({ userId: member.id})
            const memberThemeData = await Theme.findOne({ themeName: memberData.profile.theme.usedTheme })

            if (i == 0) {
                embed.setThumbnail(member.displayAvatarURL())
            }
            
            embed.addField(`${i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.` } ${member.displayName} ${i === 0 ? "— Ostentation magistrale" : i === 1 ? "— Prestige indéniable" : i === 2 ? "— Abondance grandiose" : "" }`, 
            `Fragments polaires : ${memberData.economy.coins} — Niveau : ${memberData.level.level}\n${memberThemeData.themeEmote} ${memberData.profile.signature}`)
        }
    
        interaction.reply({embeds: [embed]});
    }
}