const mongoose = require('mongoose')

const questSchema = mongoose.Schema({
    guildId: String,
    userId: String,
    username: String,
    dailies: {
        messages: {'type': Number, 'default': 0},
        mentions: {'type': Number, 'default': 0},
        event: {'type': Number, 'default': 0},
        commission: {'type': Number, 'default': 0},
        date: {'type:': Number, 'default': 0},
        reward: {'type:': Number, 'default': 0}
    }
});

module.exports = mongoose.model('Quest', questSchema);