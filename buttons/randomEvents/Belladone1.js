const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1",
    async runInteraction(client, interaction) {
        if (interaction.channel.threads.cache.find(x => x.name === `Belladone — Événement aléatoire (${interaction.user.id})`)) return interaction.reply({content: `Vous avez déjà lancé l'événement aléatoire.`, ephemeral: true});

        interaction.reply({content: `Événement aléatoire déclenché.`, ephemeral: true})

        const thread = await interaction.channel.threads.create({
            name: `Belladone — Événement aléatoire (${interaction.user.id})`,
            autoArchiveDuration: 60,
            reason: `${interaction.user.id}`,
        });

        await thread.members.add(interaction.user.id);

        await setTimeout(() => thread.delete(), 300000);

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Alors, ton séjour ici se passe bien ? Le déménagement n'a pas été trop compliqué ?`)
        .setColor("0e0524")
        .setThumbnail('https://cdn.discordapp.com/attachments/999092620796112946/999828054190854225/Belladone_1.png?width=671&height=671')
        .addFields(
            {
                name: `Réponse possible :`, value: `1. Tout se passe bien pour l'instant.`
            }
        )
        .setFooter({text: `✅ Choix pour passer au prochain dialogue`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-1')
                .setLabel('Tout se passe bien')
                .setStyle('PRIMARY'),
        );

        thread.send({ embeds: [embed], components: [ button ] });
    }
}