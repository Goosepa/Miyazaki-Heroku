const { Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    name: "belladone1-1",
    async runInteraction(client, interaction, message) {
        const profileData = await Profile.findOne({userId: interaction.user.id});
        const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme});
        const questData = await Quest.findOne({userId: interaction.user.id});

        const thread = interaction.channel

        if (!thread.name.includes(interaction.user.id)) return interaction.reply({content: `Action impossible lors de l'événement aléatoire d'un autre membre.`, ephemeral: true});

        await interaction.message.delete()

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Je suis contente que cet endroit te plaise ♥ \n\nSi tu as un peu de temps, n'hésite pas à passer au casino ! Tu ne peux pas le rater: c'est le bâtiment le plus grand tout devant, alors je compte sur toi, héhé.`)
        .setColor("0e0524")
        .setThumbnail('https://cdn.discordapp.com/attachments/999092620796112946/999828054190854225/Belladone_1.png?width=671&height=671')
        .setFooter({text: `🔁 Passage automatique au prochain dialogue`})

        const embed2 = new MessageEmbed()
        .setTitle(`Miyazaki — Super guide`)
        .setDescription(`(Euh... ${interaction.member.nickname || interaction.user.username}, souviens toi de ce qu'on nous a dit: il ne faut pas faire confiance à cette femme !!! Si tu vas au casino, tu vas devenir accro à coup sûr !!!)`)
        .setColor("FFFFFF")
        .addFields(
            {
                name: `Réponses possibles :`, value: `1. Désolé mais j'ai déjà prévu des trucs...\n\n2. Je n'ai pas beaucoup l'occasion de jouer aux jeux d'argent, ça va être drôle !`
            }
        )
        .setThumbnail('https://media.discordapp.net/attachments/996095065015451742/999732265301069964/Logo_Radiant_Realm.png?width=671&height=671')
        .setFooter({text: `✅ Choix pour passer au prochain dialogue`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1-3')
                .setLabel('Pas de casino')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('belladone1-4')
                .setLabel('Casino')
                .setStyle('DANGER')
        );

        thread.send({ embeds: [embed] }).then(await setTimeout(() => thread.bulkDelete(100), 10000));
        await setTimeout(() => thread.send({ embeds: [embed2], components: [ button ] }), 10000);
    }
}