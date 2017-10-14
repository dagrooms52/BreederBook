'use strict';
var shortid = require('shortid');
const Breeder = require('../schemas/breeder/breeder')

class BreederOrchestrator {

    constructor() {
        this.breeders = {};
    }

    getBreeder(breederId) {
        var isValidId = shortid.isValid(breederId);

        var breeder = this.breeders[breederId];
        
        if (breeder){
            return breeder;
        }

        return null;
    }

    createBreeder(breederJson) {        
        var breeder = JSON.parse(breederJson);

        // Create ID
        var id = shortid.generate();

        this.breeders.push(id, breeder);
    }

    updateBreeder(breederJson) {
        return;
    }

    deleteBreeder(breederId) {
        return;
    }

}

module.exports = BreederOrchestrator;