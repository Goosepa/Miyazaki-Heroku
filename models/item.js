const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    guildId: String,
    itemName: {'type': String, "default": 'Pass Radieux'},
    itemDescription: { 'type': String, 'default': 'Le Pass Radieux est un objet permettant de se rendre dans le Radiant Realm.' },
    itemId: { 'type': Number, 'default': 0 },
    itemCategory: { 'type': String, 'default': 'Objet de quête' },
    itemEmote: { 'type': String, 'default': '🎟️' }
    
});

module.exports = mongoose.model('Item', itemSchema);