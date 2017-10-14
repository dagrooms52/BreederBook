'use strict';

const Hapi = require('hapi');
const BreederOrchestrator = require('../orchestrators/breederOrchestrator')
const baseRoute = "/breeders"
const Validator = require('jsonschema').Validator;
const fs = require('fs');
const path = require('path');
const schemaFile = path.join(__dirname, 'jsonSchema/breeder.json');

class BreederController {

    constructor(server, breederOrchestrator){
        this.orchestrator = breederOrchestrator;
        this.validator = new Validator();
        this.breederSchema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    }

    getBreeder(breederId, reply) {
        var breederResult = this.orchestrator.getBreeder(breederId);

        if(breederResult == null){
            reply("Not found").code(404);
        }
        else {
            reply(breederResult);
        }        
    }
    
    createBreeder(breederJson, reply) {
        
        var breederData = JSON.parse(breederJson);

        var validationResult = this.validator.validate(breederData, this.breederSchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }
        
        var breederResult = this.orchestrator.createBreeder(breederData);

        reply(JSON.stringify(breederResult));
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