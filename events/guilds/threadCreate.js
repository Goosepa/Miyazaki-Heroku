module.exports = {
    name: 'threadCreate',
    once: false,
    async execute(client, thread) {
        if (thread.isText()) thread.join();
        const logChannel = client.channels.cache.get('995326497520893973');
        logChannel.send(`Miyazaki a rejoint le fil : ${thread.name} !`);
    }
};