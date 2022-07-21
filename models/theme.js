const mongoose = require('mongoose')

const themeSchema = mongoose.Schema({
    guildId: String,
    themeName: { 'type': String, 'default': 'Thème par défaut' },
    themeId: { 'type': Number, 'default': 0 },
    themeDescription: { 'type': String, 'default': 'Le thème par défaut est un thème que tout le monde reçoit au début.' },
    themeQuote: { 'type': String, 'default': 'L\'étoile polaire était le point de repère des dieux...' },
    themeImage: { 'type': String, 'default': 'https://media.discordapp.net/attachments/996095065015451742/996162384395780319/Theme_par_defaut.png' },
    themeColor: { 'type': String, 'default': 'dcdcdc' },
    themeEmote: { 'type': String, 'default': '<:default_star:996161709788102708>' }
    
});

module.exports = mongoose.model('Theme', themeSchema);