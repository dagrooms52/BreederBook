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
    breeds:[String],
    rating: {
        count: Number,
        averageRating: {
            type: Number,
            min: 1,
            max: 5
        }
    }
});

module.exports = BreederSchema;