const { MessageEmbed } = require('discord.js');
const { Profile } = require('../../models/index');
const theme = require('../../models/theme');

module.exports = {
    name: 'inventory',
    category: 'users',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/inventory`',],
    usage: '`/inventory`',
    description: 'La commande `/inventory` permet d\'afficher votre inventaire.',
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id, guildId: interaction.guild.id});

        if (profileData.inventory.length == 0 || !profileData.inventory) {
            const embed = new MessageEmbed()
            .setTitle(`Votre inventaire`)
            .setDescription(`🌠 ${profileData.economy.coins} fragment(s) polaire(s)`)
            .setColor("#ffd56c")
            .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1001233719136358492/inventory.png?width=671&height=671')
            .setFooter({text: interaction.member.nickname || interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp()
            return interaction.reply({ embeds: [embed], ephemeral: false })
        } else {
            const embed = new MessageEmbed()
            .setTitle(`Votre inventaire`)
            .setColor("#ffd56c")
            .setDescription(`🌠 ${profileData.economy.coins} fragment(s) polaire(s)`)
            .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1001233719136358492/inventory.png?width=671&height=671')
            .setFooter({ text: interaction.member.nickname || interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

            if (profileData.inventory.filter(x => x.category == 'Objets de quête') != 0) {
                embed.addField(
                    `Objets de quête`,
                    `${profileData.inventory.filter(x => x.category == 'Objets de quête').map(x => `${x.itemEmote} ${x.name} x${x.quantity}`).join('\n')}`
                )
            }

            if (profileData.inventory.filter(x => x.category == 'Objets échangeables') != 0) {
                embed.addField(
                    `Objets échangeables`,
                    `${profileData.inventory.filter(x => x.category == 'Objets échangeables').map(x => `${x.itemEmote} ${x.name} x${x.quantity}`).join('\n')}`
                )
            }

            if (profileData.inventory.filter(x => x.category == 'Collectionnables') != 0) {
                embed.addField(
                    `Collectionnables`,
                    `${profileData.inventory.filter(x => x.category == 'Collectionnables').map(x => `${x.itemEmote} ${x.name} x${x.quantity}`).join('\n')}`
                )
            }

            return interaction.reply({ embeds: [ embed ] });

        }
    
    }
}