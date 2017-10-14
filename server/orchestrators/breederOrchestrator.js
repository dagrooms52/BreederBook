'use strict';
const Breeder = require('../schemas/breeder/breeder')
const shortid = require('shortid');

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

    // Returns: Breeder (null if failed)
    createBreeder(breederData) {

        var breeder = breederData;

        // Create ID
        var id = shortid.generate().toString();

        breeder.id = id

        // Add to dictionary - this will become push to database
        if(this.breeders[id] != null) {
            // Would overwrite data - this is a server error, non-unique ID
            return null;
        }

        this.breeders[id] = breeder;

        return breeder;
    }

    // Returns: bool (success)
    updateBreeder(breederId, breederData) {
        
        // This is checked in the controller but enforced here
        breederData.id = breederId;

        if(this.breeders[breederId] == null) {
            return false;
        }

        this.breeders[breederId] = breederData;
        return true;
    }

    // TODO: Check if id exists & return false / 404
    deleteBreeder(breederId) {
        delete this.breeders[breederId]
    }

}

module.exports = BreederOrchestrator;