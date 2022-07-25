const { Profile, Theme } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dayjs = require('dayjs');
var CronJob = require('cron').CronJob;

module.exports = {
    name: 'dailies',
    category: 'economy',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/dailies`'],
    usage: '`/dailies`',
    description: 'La commande `/dailies` permet d\'afficher les quêtes quotidiennes.',
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({userId: interaction.user.id, guildId: interaction.guild.id});

        const hour = dayjs().hour()
        const minute = dayjs().minute()

        const cooldownHour = minute > 0 ? 23 - hour : 24 - hour
        const cooldownMinute = 59 - minute

        var i = 0

        const row = new MessageActionRow()
            .addComponents(
				new MessageButton()
					.setCustomId('getReward')
					.setLabel('📩 Obtenir les récompenses')
					.setStyle('SUCCESS')
			);

        if (profileData.quests.dailies.messages >= 10) i = i + 1
        if (profileData.quests.dailies.mentions >= 3) i = i + 1
        if (profileData.quests.dailies.event >= 1) i = i + 1

        if (i === 3 && profileData.quests.dailies.reward == 0) {
            const embed = new MessageEmbed()
            .setTitle(`Missions quotidiennes — ${i}/3`)
            .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1001224684840427670/dailies.png?width=671&height=671')
            .setColor("#8ca7ff")
            .setDescription(`🎉 Vous avez terminé les missions quotidiennes 🎉\n\n⭕ Les missions quotidiennes se réinitialisent tous les jours à 00h00.   Les missions quotidiennes ne prennent pas en compte les multiplicateurs de points d'expérience.`)
            .addFields(
                { name: `💬 Envoyez 10 messages dans n'importe quel salon`, value: `🆙 250 points d'expérience — Complétion : ${profileData.quests.dailies.messages < 10 ? profileData.quests.dailies.messages : "10"}/10`, inline: true },
                { name: `📧 Envoyez 3 messages en mentionnant un autre utilisateur`, value: `🆙 250 points d'expérience — Complétion : ${profileData.quests.dailies.mentions < 3 ? profileData.quests.dailies.mentions : "3"}/3`, inline: true },
                { name: `👋 Participez à 1 événement aléatoire`, value: `🆙 250 points d'expérience — Complétion : ${profileData.quests.dailies.event < 1 ? profileData.quests.dailies.event : "1"}/1`, inline: true },
                { name: `📩 Récompenses de missions quotidiennes`, value: `⭕ Vous ne pouvez récupérer qu'une seule fois les récompenses de missions quotidiennes. \n\n🆙 750 points d'expérience — 🌠 60000 fragments polaires — 🪙 1 jeton du Casino Belladone` },
            )
            .setFooter({text: `Temps avant la réinitialisation des missions quotidiennes : ${cooldownHour} heure(s) et ${cooldownMinute} minute(s)`})
            

            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
        } else {
            const embed = new MessageEmbed()
            .setTitle(`Missions quotidiennes — ${i}/3`)
            .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1001224684840427670/dailies.png?width=671&height=671')
            .setColor("#8ca7ff")
            .setDescription(`Complétez 3 missions quotidiennes pour recevoir une belle récompense !\n\n⭕ Les missions quotidiennes se réinitialisent tous les jours à 00h00. Les missions quotidiennes ne prennent pas en compte les multiplicateurs de points d'expérience.`)
            .addFields(
                { name: `💬 Envoyez 10 messages dans n'importe quel salon`, value: `🆙 250 points d'expérience — Complétion : ${profileData.quests.dailies.messages < 10 ? profileData.quests.dailies.messages : "10"}/10`, inline: true },
                { name: `📧 Mentionnez 3 membres autres que vous`, value: `🆙 250 points d'expérience — Complétion : ${profileData.quests.dailies.mentions < 3 ? profileData.quests.dailies.mentions : "3"}/3`, inline: true },
                { name: `👋 Participez à 1 événement aléatoire`, value: `🆙 250 points d'expérience — Complétion : ${profileData.quests.dailies.event < 1 ? profileData.quests.dailies.event : "1"}/1`, inline: true },
                { name: `📩 Récompenses de missions quotidiennes`, value: `⭕ Vous ne pouvez récupérer qu'une seule fois les récompenses de missions quotidiennes. \n\n🆙 750 points d'expérience — 🌠 60000 fragments polaires — 🪙 1 jeton du Casino Belladone` },
            )
            .setFooter({text: `Temps avant la réinitialisation des missions quotidiennes : ${cooldownHour} heure(s) et ${cooldownMinute} minute(s)`})
            

            return interaction.reply({ embeds: [embed], ephemeral: false })
        }
    }
};