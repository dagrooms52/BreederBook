'use strict';

const Schema = require('mongoose').Schema;

const BreederSchema = new Schema({
    name: {
        first: String,
        middle: String,
        last: String
    },
    location: {
        country: String,
        state: String,
        city: String
    },
    breeds:[String]
});

module.exports = BreederSchema;