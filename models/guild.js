const mongoose = require('mongoose')

const guildSchema = mongoose.Schema({
    id: String,
    welcomeChannel: { 'type': String, 'default': '995302729750683720' },
    byeChannel: { 'type': String, 'default': '995315484922753044' },
    logChannel: { 'type': String, 'default': '995326497520893973' },
    levelChannel: { 'type': String, 'default': '995326497520893973' },
    profileData: []
});

module.exports = mongoose.model('Guild', guildSchema);