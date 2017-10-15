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
        if (!shortid.isValid(breederId)) { return null; }

        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});

        var BreederModel = db.model('Breeder', BreederSchema);
        return await BreederModel.findOne({'id': breederId});
    }

    async searchBreeders(country="", state="", city="") {
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        
        var findQuery = {};
        if (country != ""){
            findQuery["location.country"] = country;
        }
        if (state != "") {
            findQuery["location.state"] = state;
        }
        if (city != "") {
            findQuery["location.city"] = city;
        }
        
        var BreederModel = db.model('Breeder', BreederSchema);
        return await BreederModel.find(findQuery);
    }

    // Returns: Breeder (null if failed)
    async createBreeder(breederData) {

        var breeder = breederData;

        // Create ID
        var id = shortid.generate().toString();
        breeder.id = id

        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        
        var BreederModel = db.model('Breeder', BreederSchema);
        var breederEntry = new BreederModel(breeder);
        var breederResult = await breederEntry.save();

        return breederResult
    }

    // Returns: breeder (null if failed)
    async updateBreeder(breederId, breederData) {
        if (!shortid.isValid(breederId)) { return null };
        
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        var BreederModel = db.model('Breeder', BreederSchema);        
        var result = await BreederModel.findOneAndUpdate({'id': breederId}, breederData);

        return result;
    }

    // Returns: bool success/fail
    async deleteBreeder(breederId) {
        if (!shortid.isValid(breederId)) return false;

        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        var BreederModel = db.model('Breeder', BreederSchema);    
        
        var result = await BreederModel.findOneAndRemove({'id': breederId});

        return result != null;
    }

}

module.exports = BreederOrchestrator;