const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-1",
    async runInteraction(client, interaction, message) {
        const thread = interaction.channel

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Quand je vois tous les clients s'amuser dans mon casino, je me dis que le principal ce n'est pas le gain en lui même mais la satisfaction d'avoir gagné. Les jeux de hasard proccurent la joie et voir ça, c'est vraiment passionant.`)
        .addFields(
            {
                name: `Réponses possibles :`, value: `1. Le principal c'est surtout l'argent...`
            }
        )
        .setColor("0e0524")
        .setImage('https://media.discordapp.net/attachments/999092620796112946/1001538142869913660/Belladone_Chill.png?width=1342&height=671')
        .setFooter({text: `✅ Choix pour passer au prochain dialogue`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-3')
                .setLabel(`C'est surtout l'argent...`)
                .setStyle('PRIMARY'),
        );

        return thread.send({ embeds: [embed], components: [button] });
    }
}