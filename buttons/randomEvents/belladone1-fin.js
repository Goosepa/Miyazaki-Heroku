const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-fin",
    async runInteraction(client, interaction) {
        const thread = interaction.channel

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Inutile et insignifiant... Tout dépend d'où est investi l'argent mais ça, c'est un secret. Haha, merci d'avoir discuté avec moi. Tiens, 10 jetons, j'espère te revoir bientôt.`)
        .setColor("0e0524")
        .setImage('https://media.discordapp.net/attachments/999092620796112946/1001538297253859419/Belladone_Happy.png?width=1342&height=671')
        .addFields(
            {
                name: `Récompenses de l'événement aléatoire :`, value: `1 point d'affinité avec Belladone, 10 jetons du Casino Belladone, 100000 fragments polaires`
            }
        )
        .setFooter({text: `✅ Récupérez vos récompenses d'événement aléatoire`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-récompenses')
                .setLabel('📩 Récupérer les récompenses')
                .setStyle('SUCCESS'),
        );

        return thread.send({ embeds: [embed], components: [button] });
    }
}
