'use strict';

class BreederController {
    
    baseRoute = "/breeders"

    constructor(server, breederOrchestrator){
        this.server = server;
        this.orchestrator = breederOrchestrator;
        this.setupRoutes(server)
    }

    getBreeder(request, reply) {
        var breederId = request.params.breederId
        this.orchestrator.getBreeder(breederId)
    }
    
    createBreeder(request, reply) {
        //var breederSchema = request.payload ? 

        this.orchestrator.createBreeder(request.payload)
    }

    updateBreeder(request, reply) {
        var breederId = request.params.breederId
        // var breederSchema = request.payload ?

        this.orchestrator.updateBreeder(breederId)        
    }

    deleteBreeder(request, reply) {
        return
    }

    setupRoutes(server) {
        server.route({
            method: 'GET',
            path: baseRoute + '/{breederId}',
            handler: this.getBreeder
        });

        server.route({
            method: 'POST',
            path: baseRoute
        });
    }

}

module.exports = BreederController;