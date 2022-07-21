module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Miyazaki est prêt !');

        client.user.setPresence({
            status: "idle", 
            activities: [{ name: 'aider tous les membres du Radiant Realm' }],
            type: 'WATCHING'
        });

        const devGuild = await client.guilds.cache.get('769191265756512294');
        devGuild.commands.set(client.commands.map(command => command));
    },
};