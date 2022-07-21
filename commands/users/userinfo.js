const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'userinfo',
    category: 'users',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['Utilisable en passant par le menu contextuel de Discord.'],
    usage: 'Utilisable en passant par le menu contextuel de Discord.',
    type: 'USER',
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);

        const embed = new MessageEmbed()
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
        .setColor('#FFFFFF')
        .setThumbnail( member.user.displayAvatarURL())
        .addFields(
            { name: 'Nom :', value: `${member.displayName}`, inline: true },
            { name: 'Modérateur :', value: `${member.kickable ? 'Non' : 'Oui'}`, inline: true },
            { name: 'Rôles :', value: `${member.roles.cache.map(role => role).join(', ')}`},
            { name: 'Compte créé le :', value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)` },
            { name: 'A rejoint le serveur le :', value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)` }
        )
        .setTimestamp()

        interaction.reply({ embeds : [embed] })
    }
};