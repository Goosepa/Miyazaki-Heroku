const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-fin",
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id});
        const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme});
        const questData = await Quest.findOne({userId: interaction.user.id});

        const thread = interaction.channel

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Héhé, ça fait pas longtemps qu'on se connaît mais je t'aime déjà beaucoup ! Tu me rappelles un peu mon petit frère/ma petite soeur ♥ \n\n Je ne t'embête pas plus longtemps, à très bientôt ♥`)
        .setColor("0e0524")
        .setThumbnail('https://media.discordapp.net/attachments/996095065015451742/999732265301069964/Logo_Radiant_Realm.png?width=671&height=671')
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

        thread.send({ embeds: [embed], components: [ button ] });
    }
}
