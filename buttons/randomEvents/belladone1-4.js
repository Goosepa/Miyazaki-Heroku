const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-4",
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id});

        const thread = interaction.channel

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Il est vrai que les jeux à risques peuvent être amusants pour certains ♥ Mais cependant, ce genre de sensations peuvent entraîner des danger... héhé. \n\n Bref, si tu as besoin d'aide pour quoique ce soit, tu peux m'appeler. J'ai beaucoup d'influence ici donc si de mauvaises personnes t'embêtent pour, au hasard, un endettement, je leur donnerais une bonne leçon héhé.\n\n Oh, comme tu es là, tiens, c'est pour toi: **10 jetons**. C'est la maison qui offre ♥`)
        .setColor("0e0524")
        .setThumbnail('https://media.discordapp.net/attachments/999092620796112946/999828372131680347/Belladone_3.png?width=671&height=671')
        .addFields(
            {
                name: `Réponse possible :`, value: `1. Merci beaucoup, je passerai bientôt`
            }
        )
        .setFooter({text: `✅ Choix pour passer au prochain dialogue`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-fin')
                .setLabel('Merci beaucoup')
                .setStyle('SUCCESS'),
        );

        thread.send({ embeds: [embed], components: [ button ] });
    }
}