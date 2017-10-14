'use strict';

const Enum = require('enum');

const Questions = new Enum([
    "Was the dog less than eight (8) weeks old?",
    "Did you see the parents of the dog?",
    "Did you pick up the dog from the seller's house?",
    "Were all animals kept in clean and safe conditions?",
    "Did you discover any health problems after receiving the dog?"
]);

module.exports = Questions;