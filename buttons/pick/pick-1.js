const { Profile, Theme } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');
const pick = new Set()

module.exports = {
    name: "pick-1",
    async runInteraction(client, interaction, message) {
        if (pick.has(interaction.user.id)) {
            return interaction.reply({ content: `Vous avez déjà récupéré les 🌠 **10000 fragments polaires**.`, ephemeral: true });
        } else {
            pick.add(interaction.user.id);
            setTimeout(() => {
                pick.delete(interaction.user.id);
            }, 60001)

            const profileData = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

            await Profile.updateOne({ userId: interaction.user.id, guildId: interaction.guild.id }, {
                "$set": {
                    "economy.coins" : profileData.economy.coins + 10000
                }
            });
    
            const embed = new MessageEmbed()
            .setTitle(`📩 10000 Fragments polaires reçus`)
            .setDescription(`🌠 Fragments polaires : ${profileData.economy.coins} ➡️ ${profileData.economy.coins + 10000}`)
            .setColor("FFFFFF")
            .setThumbnail('https://media.discordapp.net/attachments/1001221935386079353/1001233719136358492/inventory.png?width=671&height=671')
            .setFooter({text: `🔁 Supression du message automatique après 5 secondes`})
    
            return interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 5000))
        };
    }
}