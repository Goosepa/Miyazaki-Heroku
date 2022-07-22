const { Guild, Profile, Theme, Quest } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dayjs = require('dayjs')

const row = new MessageActionRow()
            .addComponents(
				new MessageButton()
					.setCustomId('getReward')
					.setLabel('📩 Obtenir les récompenses')
					.setStyle('SUCCESS')
			);

module.exports = {
    name: 'dailies',
    category: 'economy',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/dailies`'],
    usage: '`/dailies`',
    description: 'La commande `/dailies` permet de mettre à jour les données de la base de données.',
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id})
        const themeData = await Theme.findOne({themeName: profileData.profile.theme.usedTheme})
        const questData = await Quest.findOne({userId: interaction.user.id})

        const date = dayjs().date()
        const month = dayjs().month()

        const fullDate = `${date}.${month}`

        if (fullDate != questData.dailies.date) {
            await Quest.updateOne({userId: interaction.user.id}, {
                '$set' : {
                    'dailies.date' : `${date}.${month}`,
                    'dailies.messages' : 0,
                    'dailies.mentions' : 0,
                    'dailies.event': 0,
                    'dailies.commission': 0,
                    'dailies.reward': 0
                }
            });
            const command = client.commands.get(interaction.commandName);

            return await command.runInteraction(client, interaction)
        }

        const hour = dayjs().hour()
        const minute = dayjs().minute()

        const cooldownHour = minute > 0 ? 23 - hour : 24 - hour
        const cooldownMinute = 59 - minute

        var i = 0

        if (questData.dailies.messages >= 10) i = i + 1
        if (questData.dailies.mentions >= 3) i = i + 1
        if (questData.dailies.event >= 1) i = i + 1

        if (i === 3 && questData.dailies.reward == 0) {
            const embed = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Missions quotidiennes — ${i}/3`)
            .setColor(`${themeData.themeColor}`)
            .setDescription(`Vous avez terminé les missions quotidiennes !\n\nInformations : les missions quotidiennes se réinitialisent tous les jours à 12h00.   Les missions quotidiennes ne prennent pas en compte les multiplicateurs de points d'expérience.`)
            .addFields(
                { name: `Envoyez 10 messages dans n'importe quel salon`, value: `250 points d'expérience — Complétion : ${questData.dailies.messages}/10`, inline: true },
                { name: `Envoyez 3 messages en mentionnant un autre utilisateur`, value: `250 points d'expérience — Complétion : ${questData.dailies.mentions}/3`, inline: true },
                { name: `Participez à 1 événement aléatoire`, value: `250 points d'expérience — Complétion : ${questData.dailies.event}/1`, inline: true },
                { name: `Récompenses de missions quotidiennes`, value: `750 points d'expérience — 60000 fragments polaires — 1 jeton du Casino Belladone` },
            )
            .setFooter({text: `Temps avant la réinitialisation des missions quotidiennes : ${cooldownHour}h${cooldownMinute}`})
            

            interaction.reply({ embeds: [embed], components: [row], ephemeral: true  })
        } else {
            const embed = new MessageEmbed()
            .setTitle(`${themeData.themeEmote} Missions quotidiennes — ${i}/3`)
            .setColor(`${themeData.themeColor}`)
            .setDescription(`Complétez 3 missions quotidiennes pour recevoir une belle récompense !\n\nInformations : les missions quotidiennes se réinitialisent tous les jours à 12h00.   Les missions quotidiennes ne prennent pas en compte les multiplicateurs de points d'expérience.`)
            .addFields(
                { name: `Envoyez 10 messages dans n'importe quel salon`, value: `250 points d'expérience — Complétion : ${questData.dailies.messages}/10`, inline: true },
                { name: `Mentionnez 3 membres autres que vous`, value: `250 points d'expérience — Complétion : ${questData.dailies.mentions}/3`, inline: true },
                { name: `Participez à 1 événement aléatoire`, value: `250 points d'expérience — Complétion : ${questData.dailies.event}/1`, inline: true },
                { name: `Récompenses de missions quotidiennes`, value: `750 points d'expérience — 60000 fragments polaires — 1 jeton du Casino Belladone` },
            )
            .setFooter({text: `Temps avant la réinitialisation des missions quotidiennes : ${cooldownHour}h${cooldownMinute}`})
            

            interaction.reply({ embeds: [embed], ephemeral: false })
        }
    }
};