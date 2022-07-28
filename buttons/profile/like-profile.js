const { Profile, Theme, Guild } = require('../../models/index');
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');


module.exports = {
    name: "like-profile",
    async runInteraction(client, interaction, message) {
        const guild = await Guild.findOne({ id: interaction.guild.id }).catch(console.error);
        const interactionId = await guild.profileData.find(x => x.interactionMessageId === interaction.message.id);

        if (interactionId) {
            const mentionUser = await client.users.fetch(interactionId.mentionMember);
            const mentionMemberProfileData = await Profile.findOne({ userId: interactionId.mentionMember });
            
            if (mentionMemberProfileData.profile.likes.includes(interaction.user.id)) {
                return interaction.reply({ content: `Vous avez déjà aimé ce profil.`, ephemeral: true });
            } else {
                return interaction.reply({ content: `Vous avez aimé le profil de ${mentionUser.username}.`, ephemeral: true });
            }
        } else return interaction.reply({ content: `Oups, une erreur s'est produite lors de l'intéraction. Veuillez réessayer en renvoyant la commande !`, ephemeral: true });
    }
}