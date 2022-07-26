const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-3",
    async runInteraction(client, interaction) {
        const thread = interaction.channel

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Héhé, tu es perspicace dis donc. Oui, tu as raison, c'est principalement pour l'argent que j'ai ouvert mon casino. Mais qui fait quelque chose autre que pour l'argent ? Si tu veux mon avis, si ce n'est pas dans mon casino que les gens viennent jeter leur argent, ce sera dans des choses inutiles et insignifiantes.`)
        .setColor("0e0524")
        .setImage('https://media.discordapp.net/attachments/999092620796112946/1001538142869913660/Belladone_Chill.png?width=1342&height=671')
        .addFields(
            {
                name: `Réponse possible :`, value: `1. Le casino c'est pas inutile et insignifiant ?`
            }
        )
        .setFooter({text: `✅ Choix pour passer au prochain dialogue`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-fin')
                .setLabel('Inutile et insignifiant')
                .setStyle('PRIMARY'),
        );

        return thread.send({ embeds: [embed], components: [ button ] });
    }
}