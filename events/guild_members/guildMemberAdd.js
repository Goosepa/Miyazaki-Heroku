const { MessageEmbed } = require('discord.js');
const { Profile, Theme} = require('../../models/index');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member) {
        const fetchGuild = await client.getGuild(member.guild);

        const profileData = await Profile.findOne({ userId: member.user.id, guildId: member.guild.id });

        const embed = new MessageEmbed()
        .setAuthor( { name: `${ member.user.tag } (${member.id})`, iconURL: member.user.displayAvatarURL() })
        .setColor('#FFFFFF')
        .setTitle(`🎊 Un nouveau membre vient d'atterrir dans le Radiant Realm 🎊`)
        .setDescription(`Bienvenue ${member}, je souhaite que tu t'amuseras bien ici ! Je suis Miyazaki et je serais là pour t'accompagner !`)
        .addFields( 
            {
                name: `Compte créé le :`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`, inline: true
            },
            {
                name: `Rejoint le:`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`, inline: true
            }
        )
        .setThumbnail( member.user.displayAvatarURL())
        .setTimestamp()

        const welcomeChannel = client.channels.cache.get(fetchGuild.welcomeChannel);
        welcomeChannel.send({ embeds: [embed] });
        const logChannel = client.channels.cache.get('995326497520893973')

        if (!profileData) {
            const createProfile = new Profile({
                guildId: member.guild.id,
                userId: member.user.id,
                username: member.user.username,
                'profile.theme.allThemes': ['Thème par défaut']
            });

            await createProfile.save().then(p => logChannel.send(`Nouveau profil : ${p.id}`));
        }
    },
};
