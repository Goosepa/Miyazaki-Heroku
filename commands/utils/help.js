const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const commandFolder = readdirSync('./commands');
const { Profile, Theme } = require('../../models/index');

const contextDescription = {
    userinfo: 'La commande `/userinfo` permet d\'afficher des informations sur un utilisateur telles que ses rôles ou son surnom sur le serveur.'
}

module.exports = {
    name: 'help',
    category: 'utils',
    permissions: ['CREATE_INSTANT_INVITE'],
    ownerOnly: false,
    exemples: ['`/help`', '`/help emit`', '`/help help`'],
    usage: '`/help <commande (optionnelle)>`',
    description: `La commande \`/help\` affiche toutes les commandes ou des informations sur une commande précise.`,
    options: [
        {
            name: 'command',
            description: `Besoin d'aide ? Envoyez cette commande pour me demander tout ce qui est possible de faire !`,
            type: 'STRING',
            required: false,
        }
    ],
    async runInteraction(client, interaction) {
        const profileData = await Profile.findOne({ userId: interaction.user.id });
        const themeData = await Theme.findOne({ themeName: profileData.profile.theme.usedTheme });
        const commandName = interaction.options.getString('command');

        if (!commandName) {
            const noArgsEmbed = new MessageEmbed()
            .setColor(`${themeData.themeColor}`)
            .setTitle(`${themeData.themeEmote} Voici la liste de toutes les commandes`)
            .setDescription(`Dans cette liste, vous pourrez y trouver toutes les catégories et leurs commandes.`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: `Pour plus d'informations sur une commandes, envoie "/help <commande>"` });

            for (const category of commandFolder) {
                noArgsEmbed.addField(
                    `Les commandes ${category.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`,
                    `– \`${client.commands.filter(command => command.category == category.toLowerCase()).map(command => command.name).join(', ')}\``
                );
            }

            return interaction.reply({ embeds: [noArgsEmbed] });
        }

        const command = client.commands.get(commandName);
        if (!command) return interaction.reply({ content: `Cette commande n'existe pas.`, ephemeral: true });

        const argsEmbed = new MessageEmbed()
        .setColor(`${themeData.themeColor}`)
        .setTitle(`${themeData.themeEmote} Vous avez demandé de l'aide pour la commande ${command.name}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Description de la commande : ${command.description ? command.description : contextDescription[`${command.name}`]}`)
        .addFields(
            {
                name: `Catégorie de la commande :`, value: `${command.category}`,
            },
            {
                name: `Commande seulement utilisable par le propriétaire du serveur :`, value: `${command.ownerOnly ? 'Oui' : 'Non'}`, inline: true
            },
            {
                name: `Permission(s) à détenir pour pouvoir utiliser cette commande :`, value: `${command.permissions}`, inline: true
            },
            {
                name: `Méthode d'utilisation pour cette commande :`, value: `${command.usage}`, inline: true
            },
            {
                name: `Exemple(s) d'utilisation pour cette commande :`, value: `${command.exemples.join(` | `)}`, inline: true
            },
        )
        .setFooter({ text: `Pour accéder à la liste complète des commandes, envoie "/help" !` })

        return interaction.reply({ embeds: [argsEmbed] });
    }
};