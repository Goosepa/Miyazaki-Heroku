const { Guild, Profile } = require('../models');

module.exports = client => {
    client.getGuild = async guild => {
        const guildData = await Guild.findOne({ id: guild.id })
        return guildData;
    };

    client.createGuild = async guild => {
        const createGuild = new Guild({ id: guild.id });
        const logChannel = client.channels.cache.get('995326497520893973')

        createGuild.save().then(g => logChannel.send(`Nouveau serveur : ${g.id}`));
    };

    client.updateGuild = async (guild, settings) => {
        let guildData = await client.getGuild(guild);
        if (typeof guildData != 'object') guildData = {};
        for (const key in settings) {
            if (guildData[key] != settings[key]) guildData[key] = settings [key]
        }
        return guildData.updateOne(settings)
    };

    client.getProfile = async user => {
        const profileData = await Profile.findOne({ userId: user.id })
        return profileData;
    };

    client.createProfile = async user => {
        const createProfile = new Profile({ userId: user.id });
        const logChannel = client.channels.cache.get('995326497520893973')

        createProfile.save().then(p => logChannel.send(`Nouveau profil : ${p.id}`));
    };

    client.updateProfile = async (user, settings) => {
        let profileData = await client.getProfile(user);
        if (typeof profileData != 'object') profileData = {};
        for (const key in settings) {
            if (profileData[key] != settings[key]) profileData[key] = settings [key]
        }
        return profileData.updateOne(settings)
    };
}