'use strict';

const Hapi = require('hapi');
const BreederOrchestrator = require('../orchestrators/breederOrchestrator')
const baseRoute = "/breeders"
const Validator = require('jsonschema').Validator;
const fs = require('fs');
const path = require('path');
const schemaFile = path.join(__dirname, 'jsonSchema/breeder.json');

class BreederController {

    constructor(breederOrchestrator){
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
            reply(JSON.stringify(breederResult));
        }        
    }
    
    createBreeder(breederJson, reply) {
        
		console.log(breederJson);
		
        var breederData = breederJson;

        var validationResult = this.validator.validate(breederData, this.breederSchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }
        
        var breederResult = this.orchestrator.createBreeder(breederData);

        if(breederResult == null) {
            // If generated ID was not unique, rather fail than overwrite data
            reply("Internal server error.").code(500);
        }

        reply(JSON.stringify(breederResult));
    }

    updateBreeder(breederId, breederJson, reply) {
        var breederData = JSON.parse(breederJson);

        if(breederData.id != null && breederData.id != breederId){
            reply("Bad request. Breeder ID does not match route's breeder ID.").code(400);
            return;
        }

        var validationResult = this.validator.validate(breederData, this.breederSchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }

        var updateResult =  this.orchestrator.updateBreeder(breederId, breederData);

        if(updateResult) {
            reply().code(200);
        } 
        else {
            reply("Not found").code(404);
        }
    }

    deleteBreeder(breederId, reply) {
        this.orchestrator.deleteBreeder(breederId)
        reply().code(200);
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
            method: 'PUT',
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