module.exports = {
    name: 'emit',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/emit guildMemberAdd`', '`/emit guildMemberRemove`'],
    usage: '`/emit <événement>`',
    description: 'La commande `/emit` permet d\'émettre un événement. Commande est réservée au propriétaire du serveur.',
    options: [
        {
            name: 'event',
            description: 'Choisir un événement à émettre.',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove'
                },
                {
                    name: 'guildCreate',
                    value: 'guildCreate'
                }
            ]
        }
    ],
    runInteraction: (client, interaction) => {
        const eventChoices = interaction.options.getString('event');

        if (eventChoices == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content : 'Miyazaki a émit l\'événemement guildMemberAdd !', ephemeral: true });
        } else if (eventChoices == 'guildCreate') {
            client.emit('guildCreate', interaction.guild);
            interaction.reply({ content : 'Miyazaki a émit l\'événemement guildCreate !', ephemeral: true })
        } else {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content : 'Miyazaki a émit l\'événemement guildMemberRemove !', ephemeral: true });
        }
    }
};