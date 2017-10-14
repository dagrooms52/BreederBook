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

    setupRoutes(server) {
        var controller = this;

        // GET /breeders/{breederId}
        server.route({
            method: 'GET',
            path: baseRoute + '/{breederId}',
            handler: function(request, reply){
                var breederId = encodeURIComponent(request.params.breederId);
                var result = controller.getBreeder(breederId, reply);
            }
        });

        // POST /breeders
        server.route({
            method: 'POST',
            path: baseRoute,
            handler: function(request, reply){
                var breederJson = request.payload;
                controller.createBreeder(breederJson, reply)
            }
        });

        // PATCH /breeders/{breederId}
        server.route({
            method: 'PATCH',
            path: baseRoute + '/{breederId}',
            handler: function(request, reply){
                var breederId = encodeURIComponent(request.params.breederId);
                var breederJson = request.payload;
                var result = controller.updateBreeder(breederId, breederJson, reply)
            }
        });

        // DELETE /breeders/{breederId}
        server.route({
            method: 'DELETE',
            path: baseRoute + '/{breederId}',
            handler: function(request, reply){
                var breederId = encodeURIComponent(request.params.breederId);
                var result = controller.deleteBreeder(breederId, reply);
            }
        });
    }

}

module.exports = BreederController;