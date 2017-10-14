'use strict';

const BreederOrchestrator = require('../orchestrators/breederOrchestrator')
const baseRoute = "/breeders"

class BreederController {

    constructor(server, breederOrchestrator){
        this.server = server;
        this.orchestrator = breederOrchestrator;
        this.setupRoutes(server)
    }

    getBreeder(request, reply) {
        var breederId = request.params.breederId;
        
        this.orchestrator.getBreeder(breederId);
    }
    
    createBreeder(request, reply) {
        // TODO: validate payload
        var breederJson = request.payload;

        this.orchestrator.createBreeder(breederJson);
    }

    updateBreeder(request, reply) {
        // TODO: validate payload

        var breederId = request.params.breederId;
        // var breederSchema = request.payload ?

        this.orchestrator.updateBreeder(breederId);     
    }

    deleteBreeder(request, reply) {
        var breederId = request.params.breederId;

        this.orchestrator.deleteBreeder(breederId);
    }

    setupRoutes(server) {
        server.route({
            method: 'GET',
            path: baseRoute + '/{breederId}',
            handler: this.getBreeder
        });

        server.route({
            method: 'POST',
            path: baseRoute,
            handler: this.createBreeder
        });

        server.route({
            method: 'PATCH',
            path: baseRoute + '/{breederId}',
            handler: this.updateBreeder
        });

        server.route({
            method: 'DELETE',
            path: baseRoute + '/{breederId}',
            handler: this.deleteBreeder
        });
    }

}

module.exports = BreederController;