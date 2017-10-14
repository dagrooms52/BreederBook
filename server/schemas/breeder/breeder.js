'use strict';

const Name = require('./name');
const Location = require('./location');
const Breed = require('./breed');
const Rating = require('./rating');

class Breeder {

    constructor(internalId, name, location, breeds, rating) {
        this.id = internalId;
        this.name = name;
        this.location = location;
        this.breeds = breeds;
        this.rating = rating;
    }

}

module.exports = Breeder;