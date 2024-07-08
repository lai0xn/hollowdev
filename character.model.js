const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your character name"],
    },
    level: {
        type: Number,
        required: false,
        default: 1,
        min : 1 ,
        max : 100,
    },
    hp: {
        type: Number,
        required: false,
        default: 1000,
        min : 0 ,
        max : 1000,
    },
    attributes: {
        strength: {
            type: Number,
            required: false,
            default: 1,
            min : 1 ,
            max : 10,
        },
        agility: {
            type: Number,
            required: false,
            default: 1,
            min : 1 ,
            max : 10,
        },
        intelligence: {
            type: Number,
            required: false,
            default: 1,
            min : 1 ,
            max : 10,
        },
        endurance: {
            type: Number,
            required: false,
            default: 1,
            min : 1 ,
            max : 10,
        },
    },
   
});

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
