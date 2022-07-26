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
        .setDescription(`Tu es allé(e) récemment au casino ? Héhé, j'imagine que tu n'as pas été très chanceux/chanceuse. Ne t'inquiète pas, un gros gain va arriver à un moment où à un autre si tu continues à jouer. En plus, les points de pitié peuvent aussi t'aider à avoir quelque chose que tu veux !`)
        .setColor("0e0524")
        .setImage('https://media.discordapp.net/attachments/999092620796112946/1001538297253859419/Belladone_Happy.png?width=1342&height=671')
        .addFields(
            {
                name: `Réponse possible :`, value: `1. Heureusement que les points de pitié existent...`
            }
        )
        .setFooter({text: `✅ Choix pour passer au prochain dialogue`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-1')
                .setLabel('Points de pitié')
                .setStyle('PRIMARY'),
        );

        return thread.send({ embeds: [embed], components: [ button ] });
    }
}