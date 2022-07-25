const { MessageEmbed } = require('discord.js');
const { Profile, Theme } = require('../../models/index');

module.exports = {
    name: 'ping',
    category: 'utils',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/ping`'],
    usage: '`/ping`',
    description: 'La commande `/ping` permet de connaître la latence entre l\'API et le bot.',
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        const themeData = await Theme.findOne({ themeName: profileData.profile.theme.usedTheme });
        const embed = new MessageEmbed()
        .setTitle(`${themeData.themeEmote} Tu as effectué la commande \`/ping\` !`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Je te réponds donc "Pong" !\n`)
        .setColor(`${themeData.themeColor}`)
        .addField('Latence', `\`${client.ws.ping}ms\``, true)
        .setTimestamp()
        .setFooter({ text: interaction.member.nickname || interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        interaction.reply({ embeds : [embed] })
    }
};