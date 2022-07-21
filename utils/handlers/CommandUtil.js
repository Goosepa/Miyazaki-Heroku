const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async commandFile => {
        const command = require(commandFile);
        
        if (!command.name || ( !command.description && command.type != 'USER' )) return console.log(`----------\n Commande non-déclenchée : erreur de typographie, pas de description et, ou, nom inconnu. \n Fichier -> ${commandFile}\n ----------`)

        if (!command.permissions) return console.log(`----------\n Commande non-chargée : pas de permissions précisées. \n Fichier -> ${commandFile}\n ----------`);

        if (!command.exemples) return console.log(`----------\n Commande non-chargée : pas d'exemples précisées. \n Fichier -> ${commandFile}\n ----------`);

        if (command.ownerOnly == undefined) return console.log(`----------\n Commande non-chargée : indiquez si la commande ne peut être effectuée que par le propriétaire du serveur. \n Fichier -> ${commandFile}\n ----------`);

        if (!command.usage) return console.log(`----------\n Commande non-chargée : pas d'usage précisé. \n Fichier -> ${commandFile}\n ----------`);

        if (!command.category) return console.log(`----------\n Commande non-chargée : pas de catégorie. \n Fichier -> ${commandFile}\n ----------`);

        command.permissions.forEach(permission => {
            if (!permissionList.includes(permission)) {
                return console.log(`----------\n Événement non-chargé : erreur de typographie. \n Fichier -> ${permission}\n ----------`)
            }
        });

        client.commands.set(command.name, command);
        console.log(`Commande chargée : ${command.name}`)
    });
};

const permissionList = [ 'CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHTS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS', 'USE_APPLICATION_COMMANDS', 'REQUEST_TO_SPEAK', 'MANAGE_EVENTS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'CREATE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'CREATE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS', 'START_EMBEDDED_ACTIVITIES', 'MODERATE_MEMBERS' ];
