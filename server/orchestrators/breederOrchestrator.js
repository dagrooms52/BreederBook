'use strict';
const Breeder = require('../schemas/breeder/breeder')
const shortid = require('shortid');
const BreederSchema = require('../database/schemas/breeder');
const Mongoose = require('mongoose');

class BreederOrchestrator {

    constructor(dbConnectionUri) {
        this.breeders = {};
        this.dbConnectionUri = dbConnectionUri;
    }

    async getBreeder(breederId) {
        var isValidId = shortid.isValid(breederId);
        if (!isValidId) return null;

        console.log("Creating connection")
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        console.log("Entering data lookup")
        console.log("Looking for breeder id " + breederId)

        var BreederModel = db.model('Breeder', BreederSchema);
        return await BreederModel.findOne({'id': breederId});
    }

    // Returns: Breeder (null if failed)
    async createBreeder(breederData) {

        console.log("Got breeder data in orchestrator")
        var breeder = breederData;

        // Create ID
        var id = shortid.generate().toString();

        console.log("Id is going to be " + id);
        breeder.id = id

        // Add to dictionary - this will become push to database
        if(this.breeders[id] != null) {
            // Would overwrite data - this is a server error, non-unique ID
            return null;
        }

        console.log("opening mongo connection");
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        
        var BreederModel = db.model('Breeder', BreederSchema);
        var breederEntry = new BreederModel(breeder);
        console.log("saving breeder");
        var breederResult = await breederEntry.save();
        console.log("breeder saved")
        return breederResult
    }

    // Returns: bool (success)
    async updateBreeder(breederId, breederData) {
        
        // This is checked in the controller but enforced here
        breederData.id = breederId;

        if(this.breeders[breederId] == null) {
            return false;
        }

        this.breeders[breederId] = breederData;
        return true;
    }

    // TODO: Check if id exists & return false / 404
    async deleteBreeder(breederId) {
        delete this.breeders[breederId]
    }

}

module.exports = BreederOrchestrator;