const ownerID = '638436496596008972';
const { Profile, Theme, Guild } = require('../../models/index')

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        const guildSettings = await Guild.findOne({ guildId: interaction.guild.id })
        const profileData = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guild.id }) && await Profile.findOne({ guildId: interaction.guild.id });
        const themeData = await Theme.findOne({ guildId: interaction.guild.id })
        const logChannel = client.channels.cache.get('995326497520893973')

        if (!profileData) {
            const createProfile = new Profile({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                username: interaction.user.username,
                profile: {
                    birthday: {
                        day: 0,
                        month: 0
                    },
                    signature: `Pas de signature pour l'instant.`,
                    mp: 0,
                    theme: {
                        usedTheme: 'Thème par défaut',
                        allThemes: "Thème par défaut"
                    }
                },
                'profile.theme.allThemes': ['Thème par défaut']
            });

    
            await createProfile.save().then(p => logChannel.send(`Nouveau profil : ${p.id}`));
        };

        if (!themeData) {
            const createTheme = new Theme({
                guildId: interaction.guild.id,
            });
            const logChannel = client.channels.cache.get('995326497520893973')
    
            await createTheme.save().then(p => logChannel.send(`Nouveau thème : ${p.id}`));
        };

        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply(`Cette commande n'existe pas...`);

            if (command.ownerOnly) {
                if (interaction.user.id != ownerID) return interaction.reply({ content : `Désolé ${interaction.member.nickname || interaction.user.username}, seul le propriétaire du serveur peut demander ça à Miyazaki.`, ephemeral: true});
            }

            if (!interaction.member.permissions.has([command.permissions])) return interaction.reply({ content : `Désolé ${interaction.member.nickname || interaction.user.username}, tu n'as pas les permissions pour demander ça à Miyazaki`, ephemeral: true});

            command.runInteraction(client, interaction, guildSettings);

        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return interaction.reply(`Ce bouton n'existe pas...`);
            button.runInteraction(client, interaction, guildSettings);

        } else if (interaction.isSelectMenu()) {
            const selectMenu = client.selects.get(interaction.customId);
            if (!selectMenu) return interaction.reply(`Cette sélection n'existe pas...`);
            selectMenu.runInteraction(client, interaction, guildSettings);
            
        }
    },
};