'use strict';
const Breeder = require('../schemas/breeder/breeder')
const BreederSchema = require('../database/schemas/breeder');
const Mongoose = require('mongoose');

class BreederOrchestrator {

    constructor(dbConnectionUri) {
        this.breeders = {};
        this.dbConnectionUri = dbConnectionUri;
    }

    async getBreeder(breederId) {
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});

        var BreederModel = db.model('Breeder', BreederSchema);
        return await BreederModel.findById(breederId);
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
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});

        var BreederModel = db.model('Breeder', BreederSchema);
        var breederEntry = new BreederModel(breederData);
        var breederResult = await breederEntry.save();

        return breederResult
    }

    // Returns: breeder (null if failed)
    async updateBreeder(breederId, breederData) {        
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        var BreederModel = db.model('Breeder', BreederSchema);        
        var result = await BreederModel.findByIdAndUpdate(breederId, breederData, {new: true});

        return result;
    }

    // Returns: bool success/fail
    async deleteBreeder(breederId) {
        var db = await Mongoose.createConnection(this.dbConnectionUri, {useMongoClient: true});
        var BreederModel = db.model('Breeder', BreederSchema);    
        
        var result = await BreederModel.findByIdAndRemove(breederId);

        return result != null;
    }

}

module.exports = BreederOrchestrator;