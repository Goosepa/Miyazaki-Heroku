module.exports = {
    name: 'dbconfig',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/dbconfig welcomeChannel`', '`/dbconfig logChannel`'],
    usage: '`/dbconfig <clé> <valeur (optionnelle)>`',
    description: 'La commande `/dbconfig` permet de configurer les données de la base de données.',
    options: [
        {
            name: 'clé',
            description: 'Choisir une clé à modifier ou à afficher.',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'welcomeChannel',
                    value: 'welcomeChannel'
                },
                {
                    name: 'byeChannel',
                    value: 'byeChannel'
                },
                {
                    name: 'logChannel',
                    value: 'logChannel'
                },
                {
                    name: 'levelChannel',
                    value: 'levelChannel'
                }
            ]
        },
        {
            name: 'valeur',
            description: 'Choisir une nouvelle valeur pour votre clé.',
            type: 'STRING',
        }

    ],
    async runInteraction(client, interaction, guildSettings) {
        const key = interaction.options.getString('clé');
        const value = interaction.options.getString('valeur')

        if (key == 'welcomeChannel') {
            if (value) {
                await client.updateGuild(interaction.guild, { welcomeChannel: value });
                return interaction.reply({ content : `Miyazaki a changé le salon où seront annoncés les nouveaux membres (${guildSettings.welcomeChannel}) !` });
            }
            interaction.reply({ content : `Voici le salon où sont annoncés les nouveaux membres : ${guildSettings.welcomeChannel}.` });

        } else if (key == 'byeChannel') {
            if (value) {
                await client.updateGuild(interaction.guild, { byeChannel: value });
                return interaction.reply({ content : `Miyazaki a changé le salon où seront annoncés les départs de membres (${guildSettings.byeChannel}) !` });
            }
            interaction.reply({ content : `Voici le salon où sont annoncés les départs de membres : ${guildSettings.byeChannel}.` });
        } else if (key == 'logChannel'){
            if (value) {
                await client.updateGuild(interaction.guild, { logChannel: value });
                return interaction.reply({ content : `Miyazaki a changé le salon où seront envoyés les log (${guildSettings.logChannel}) !` });
            }
            interaction.reply({ content : `Voici le salon où seront envoyés les log : (${guildSettings.logChannel}).` });
        } else if (key == 'levelChannel'){
            if (value) {
                await client.updateGuild(interaction.guild, { levelChannel: value });
                return interaction.reply({ content : `Miyazaki a changé le salon où seront envoyés les annonces de niveau (${guildSettings.levelChannel}) !` });
            }
            interaction.reply({ content : `Voici le salon où seront envoyés les annonces de niveau : (${guildSettings.levelChannel}).` });
        }
    }
};