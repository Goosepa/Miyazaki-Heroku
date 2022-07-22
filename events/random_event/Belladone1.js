const ownerID = '638436496596008972';
const { Profile, Theme, Quest } = require('../../models/index')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const interactionCreate = require('../client/interactionCreate');
const dayjs = require('dayjs');
const Belladone1 = require('../../buttons/randomEvents/Belladone1');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if(message.author.bot) return;
        const cooldown = await Quest.findOne({ userId: "638436496596008972" })

        const minute = dayjs().minute()

        console.log(minute)

        if (minute < cooldown.randomEvent.belladone1 + 10) return console.log('Cooldown Belladone')

        const profileData = await Profile.findOne({userId: message.member.user.id});
        const questData = await Quest.findOne({userId: message.member.user.id});

        if (message.channel.isThread()) return;

        const embed = new MessageEmbed()
        .setTitle(`Belladone — Directrice du Casino Belladone`)
        .setDescription(`Oh~ Je ne pensais pas te croiser de sitôt. Héhé, c'est le moment pour moi d'ajouter un nouveau membre fidèle à mon casino ♥ `)
        .setColor("0e0524")
        .setThumbnail('https://cdn.discordapp.com/attachments/999092620796112946/999828054677405737/Belladone_2.png?width=671&height=671')
        .setFooter({text: `👋 Déclencher l'événement aléatoire`})

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('belladone1')
                .setLabel('👋 Salut Belladone')
                .setStyle('SUCCESS')
        );

        var eventChances = Math.random() * 100 + 1

        console.log(eventChances)

        if (eventChances <= 50) {
            await Quest.updateMany({ userId: "638436496596008972" }, {
                "$set": {
                    "randomEvent": {
                        "belladone": minute
                    }
                }
            });

            console.log("Belladone cooldown set")

            message.channel.send({embeds: [embed], components: [ button ] }).then(msg => {setTimeout(() => msg.delete(), 300000)}).catch(console.error);
        };
    }
}