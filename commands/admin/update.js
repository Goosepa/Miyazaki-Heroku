const { Guild, Profile, Theme, Item } = require('../../models/index');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'update',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    exemples: ['`/update`'],
    usage: '`/update`',
    description: 'La commande `/update` permet de mettre à jour les données de la base de données.',
    async runInteraction(client, interaction) {
        const channel = interaction.channel

        const embed = new MessageEmbed()
        .setTitle(`RÈGLEMENT DU RADIANT REALM`)
        .setDescription(`Bienvenue dans le Radiant Realm ! Avant de pouvoir accéder au reste du serveur, tu vas devoir accepter plusieurs conditions qui seront écrits ci-dessous. Ces conditions permettent la paix et l'harmonie dans le serveur et peut-être dans le monde s'ils sont appliqués à cet échelle. Tu dois tout d'abord savoir que le serveur n'a pas une politique punitive et le conseil d'administration essaiera plus d'être dans le pardon et le guide pour devenir une meilleure personne. Cependant, dans des cas extrêmes ou si les personnes qui ont un comportement n'arrivent vraiment pas à comprendre, des sanctions peuvent être décidées.`)
        .setThumbnail(`https://media.discordapp.net/attachments/1001221935386079353/1001224684840427670/dailies.png?width=671&height=671`)
        .addFields(
            { name: `I — Le respect`, value: `Tous les membres de ce serveur, y compris modérateur, y compris administrateur, doivent le respect à tout le monde. un respect sincère, sans hypocrisie et de la meilleure des volontés est exigé envers tous les membres, peu importe leur passé, leur genre, leur religion, leur sexualité, leur nationalité, leur situation financière, leur âge, etc...

            Si un membre trouve que des personnes lui manque de respect, il peut demander au conseil d'administration dans un premier temps de voir si le problème peut être réglé sans sanction, puis dans un deuxième temps, et on ne l'espère pas, de prendre des sanctions si la personne ne veut vraiment rien entendre.
            
            Le respect compte aussi en privé : si un membre reçoit des messages de haine en messages privés ou qu'il soit insulté sans qu'il en ait connaissance, le conseil d'administration peut intervenir même s'il n'y a pas eu de plainte s'il en perçoit la nécessité. Cette règle s'applique aussi aux administrateurs.`, inline: false },
            { name: `II — L'ambiance du serveur`, value: ` Le serveur a pour but d'entretenir une ambiance où le plus grand nombre de personnes pourraient s'y sentir bien. De ce fait, tout le monde est considéré comme égal : les membres sont des membres, les modérateurs sont des membres, les administrateurs aussi et même l'owner. Le statut ne doit pas vous freiner dans vos soifs de rencontre. Tous contenus qui pourrait gêner les autres membres sont à éviter.

            Le troll est autorisé dans le cadre où toutes les personnes qui sont en communication avec la personne concernée sont d'accord. De ce fait, écouter de l'ASMR de personnes qui font du sport dans les vocaux est autorisé seulement si tout le monde dans le salon est consentant et prévenu à l'avance. Si une personne est mal à l'aise ou a été prise au dépourvu lors de l'émission de ces son et souhaite qu'il soit arrêté, la personne qui a eu cette merveilleuse idée est priée d'arrêter.`, inline: false },
            { name: `III — Apprenez à vous amuser !`, value: `Le principal en venant sur ce serveur est de vous amuser ! Pour pouvoir profiter de la joie à 100% et pour tout le monde, il faut participer activement à la vie du serveur, dans la mesure du possible du moins, pour que les puissent se familiariser avec vous. Prendre connaissance des activités sur le serveur peut vous le faire voir d'une manière complètement différente aussi !

            Votre joie ne doit pas empêcher celui des autres. Si vous discutez passionnément de quelque chose mais que vous n'êtes pas dans le salon approprié et que cela gêne des gens, vous êtes prié d'aller dans le bon salon. Dans le cadre où tout le monde discute passionnément et que le fait que vous n'êtes pas dans le bon salon ne gêne personne, vous pouvez y rester. Cependant, dans le cadre où vos messages cachent des informations importantes, vous êtes prié de supprimer vos messages.`, inline: false },
            { name: `IV — Autres règles`, value: `Les doubles comptes lorsque vous avez été banni sont interdits. Si vous voulez revenir dans le serveur après votre bannissement, parlez en au conseil de discipline en messages privés ou demandez à un.e ami.e présent.e sur le serveur de vous mettre en contact avec quelqu'un. Les doubles comptes pour éviter des problèmes techniques sont autorisés.

            Les dramas, problèmes personnels, doivent être contenus : une propagation à tout le serveur serait problématique. Donc si vous avez un problème avec d'autres membres, parlez au conseil d'administration qui s'occupera de comprendre le problème et d'en discuter avec les personnes concernées.
            
            La publicité déguisée est interdite, si vous voulez en faire, demandez l'accord du conseil d'administration. Dans le cadre de publicité vers des comptes dans le domaine de la création, un salon est mit à disposition. La publicité vers d'autres serveurs Discord est autorisée mais son contenu doit être moralement acceptable.`, inline: false },
            { name: `IV — Autres règles II`, value: `Le contenu NSFW ne doit pas fuiter vers d'autres salons. En cas de fuite, mentionnez immédiatement le conseil de discipline ou supprimez les messages dans le ca où c'est vous qui êtes responsable de cette situation.`, inline: false },
        )
        .setColor('FFFFFF')
        .setFooter({ text: `ℹ️ Le conseil d'administration peut se permettre de rajouter ou modifier des règles` })
        interaction.channel.send({ embeds: [embed] })
    }
};