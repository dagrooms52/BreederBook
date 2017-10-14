'use strict';
var shortid = require('shortid');
const Breeder = require('../schemas/breeder/breeder')

class BreederOrchestrator {

    constructor() {
        this.breeders = {};
    }

    getBreeder(breederId) {
        var isValidId = shortid.isValid(breederId);

        var breeder = this.breeders[breederId.toString()];
        
        console.log("get breeder data");
        console.log(breeder);

        if (breeder){
            return breeder;
        }

        return null;
    }

    createBreeder(breederData) {

        var breeder = breederData;

        // Create ID
        var id = shortid.generate().toString();

        breeder.id = id

        // Add to dictionary - this will become push to database
        this.breeders[id] = breeder;

        return breeder;
    }

    updateBreeder(breederJson) {
        return;
    }

    deleteBreeder(breederId) {
        delete this.breeders[breederId]
    }

}

module.exports = BreederOrchestrator;