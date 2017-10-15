'use strict';

const Hapi = require('hapi');
const BreederOrchestrator = require('../orchestrators/breederOrchestrator')
const baseRoute = "/breeders"
const Validator = require('jsonschema').Validator;
const fs = require('fs');
const path = require('path');
const schemaFile = path.join(__dirname, 'jsonSchema/breeder.json');
const instapromise = require('instapromise');

class BreederController {

    constructor(breederOrchestrator){
        this.orchestrator = breederOrchestrator;
        this.validator = new Validator();
        this.breederSchema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    }

    async getBreeder(breederId, reply) {
        var breeder = await this.orchestrator.getBreeder(breederId);
        if(breeder != null) {
            reply(breeder);
        }
        else {
            reply("Not found").code(404);
        }
    }
    
    async createBreeder(breederJson, reply) {
        
        var breederData = breederJson;

        var validationResult = this.validator.validate(breederData, this.breederSchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }
        
        var breederResult = await this.orchestrator.createBreeder(breederData);

        if(breederResult == null) {
            // If generated ID was not unique, rather fail than overwrite data
            reply("Internal server error.").code(500);
        }

        reply(JSON.stringify(breederResult));
    }

    async updateBreeder(breederId, breederJson, reply) {
        var breederData = breederJson;

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

        var updateResult = await this.orchestrator.updateBreeder(breederId, breederData);

        if(updateResult != null) {
            reply(updateResult);
        }
        else {
            reply("Not found").code(404);
        }
    }

    async deleteBreeder(breederId, reply) {
        var result = await this.orchestrator.deleteBreeder(breederId)
        if(result){
            reply().code(200);
        }
        else {
            reply("Not found").code(404)
        }
    }

    // All routes are set up for promise handling
    setupRoutes(server) {
        var controller = this;

        // GET /breeders/{breederId}
        server.route({
            method: 'GET',
            path: baseRoute + '/{breederId}',
            handler: function(request, reply){
                var breederId = encodeURIComponent(request.params.breederId);
                var promise = controller.getBreeder(breederId, reply);
                promise.then(
                    function(){
                        console.log("Request completed")
                    }, 
                    function(){
                        console.log("Error occurred")
                    });
            }
        });

        // POST /breeders
        server.route({
            method: 'POST',
            path: baseRoute,
            handler: function(request, reply) {
                var breederJson = request.payload;
                var promise = controller.createBreeder(breederJson, reply);
                promise.then(
                    function(){
                        console.log("Request completed")
                    }, 
                    function(){
                        console.log("Error occurred")
                    });
            }
        });

        // PATCH /breeders/{breederId}
        server.route({
            method: 'PUT',
            path: baseRoute + '/{breederId}',
            handler: function(request, reply) {
                var breederId = encodeURIComponent(request.params.breederId);
                var breederJson = request.payload;
                var promise = controller.updateBreeder(breederId, breederJson, reply);
                promise.then(
                    function(){
                        console.log("Request completed")
                    }, 
                    function(){
                        console.log("Error occurred")
                    });
            }
        });

        // DELETE /breeders/{breederId}
        server.route({
            method: 'DELETE',
            path: baseRoute + '/{breederId}',
            handler: function(request, reply) {
                var breederId = encodeURIComponent(request.params.breederId);
                var promise = controller.deleteBreeder(breederId, reply);
                promise.then(
                    function(){
                        console.log("Request completed")
                    }, 
                    function(){
                        console.log("Error occurred")
                    });           
            }
        });
    }

}

module.exports = BreederController;