'use strict';

const Hapi = require('hapi');
const BreederOrchestrator = require('../orchestrators/breederOrchestrator')
const baseRoute = "/breeders"

class BreederController {

    constructor(server, breederOrchestrator){
        this.orchestrator = breederOrchestrator;
    }

    getBreeder(breederId, reply) {
        reply(this.orchestrator.getBreeder(breederId));
    }
    
    createBreeder(breederJson, reply) {
        // TODO: validate payload

        var breederData = JSON.parse(breederJson);
        var breederResult = this.orchestrator.createBreeder(breederData);

        reply(JSON.stringify(breederResult))
    }

    updateBreeder(breederId, breederJson, reply) {
        // TODO: validate payload

        // var breederSchema = request.payload ?

        var breederData = JSON.parse(breederJson);

        reply(this.orchestrator.updateBreeder(breederId, breederJson));   
    }

    deleteBreeder(breederId, reply) {
        reply(this.orchestrator.deleteBreeder(breederId));
    }

}

module.exports = BreederController;