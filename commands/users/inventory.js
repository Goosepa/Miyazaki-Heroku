const { MessageEmbed } = require('discord.js');
const { Profile, Theme, Quest, Item } = require('../../models/index');
const theme = require('../../models/theme');

module.exports = {
    name: 'inventory',
    category: 'users',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/inventory signature : <nouvelle signature>`','`/inventory <@membre>`'],
    usage: '`/inventory <option || membre>`',
    description: 'La commande `/inventory` permet de montre votre profil ou de montrer celui du membre mentionné.',
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id});

        if (profileData.inventory.length == 0 || !profileData.inventory) {
            return interaction.reply({ content: `Vous n'avez pas encore d'objets.` })
        } else {
            const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme});
            const questData = await Quest.findOne({userId: interaction.user.id});

            const embed = new MessageEmbed()
            .setTitle(`Votre inventaire`)
            .setColor(`${themeData.themeColor}`)
            .setFooter({text:`Type d'objets en tout : ${profileData.inventory.length }`, iconURL: interaction.user.displayAvatarURL()})

            if (profileData.inventory.filter(x => x.category == 'Objets de quête') != undefined) {
                embed.addField(
                    `Objets de quête`,
                    `${profileData.inventory.filter(x => x.category == 'Objets de quête').map(x => `${x.itemEmote} ${x.name} x${x.quantity}`).join('\n')}`
                )
            }

            if (profileData.inventory.filter(x => x.category == 'Objets échangeables') != undefined) {
                embed.addField(
                    `Objets échangeables`,
                    `${profileData.inventory.filter(x => x.category == 'Objets échangeables').map(x => `${x.itemEmote} ${x.name} x${x.quantity}`).join('\n')}`
                )
            }

            profileData.inventory.filter(x => x.category == 'Objets échangeables').map(x => x.name).join('\n')

            return interaction.reply({ embeds: [ embed ] });

        }
    
    }
}