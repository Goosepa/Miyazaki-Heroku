const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    guildId: String,
    userId: String,
    username: String,
    profile: {
        birthday: {
            day: {
                'type': Number,
                'default': 0
            },
            month: {
                'type': Number,
                'default': 0
            }
        },
        signature: {
            'type': String,
            'default': `Pas de signature pour l'instant.`
        },
        mp: {
            'type': Number,
            'default': 0
        },
        theme: {
            usedTheme: {
                'type': String,
                'default': 'Thème par défaut'
            },
            allThemes: ["Thème par défaut"]
        }
    },
    level: {
        level: {
            'type': Number,
            'default': 0
        },
        experience: {
            'type': Number,
            'default': 0
        }
    },
    economy: {
        coins: {
            'type': Number,
            'default': 100000
        }
    },
    inventory: [{ name: {'type': String, "default": "Pass Radieux"}, quantity: {'type': Number, "default": 0}, category: {'type': String, "default": "Objets de quête"}, itemEmote: {'type': String, "default": "🎟️"} }],
    friendship: {
        belladone: {'type': Number, 'default': 0}
    }
    
});

module.exports = mongoose.model('Profile', profileSchema);