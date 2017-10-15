'use strict';

const Hapi = require('hapi');
const SurveyOrchestrator = require('../orchestrators/surveyOrchestrator');
const BreederOrchestrator = require('../orchestrators/breederOrchestrator');
const UserOrchestrator = require('../orchestrators/userOrchestrator');
const baseRoute = "/surveys";
const Validator = require('jsonschema').Validator;
const fs = require('fs');
const path = require('path');
const schemaFile = path.join(__dirname, 'jsonSchema/survey.json');

class SurveyController {

    constructor(surveyOrchestrator, breederOrchestrator, userOrchestrator){
        this.orchestrator = surveyOrchestrator;
        this.breederOrchestrator = breederOrchestrator;
        this.userOrchestrator = userOrchestrator

        this.validator = new Validator();
        this.surveySchema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    }

    async getSurvey(surveyId, reply) {
        var surveyResult = await this.orchestrator.getSurvey(surveyId);

        if(surveyResult == null){
            reply("Not found").code(404);
        }
        else {
            reply(surveyResult);
        }        
    }

    async getSurveysForBreeder(breederId, reply) {
        var surveys = await this.orchestrator.getSurveysForBreeder(breederId);

        reply(surveys);
    }
    
    // Make sure the breederId and userId exist in the system
    async createSurvey(surveyJson, reply) {
        
        var surveyData = surveyJson;

        // Validate that the referenced resources exist
        var referencedBreeder = await this.breederOrchestrator.getBreeder(surveyData.breederId);
        if(referencedBreeder == null) {
            reply("Bad request").code(400);
        }

        // Not required in V0 - will be required once hooked to OAuth
        if(surveyData.userId) {
            var referencedUser = await this.userOrchestrator.getUser(surveyData.userId);
            if(referencedUser == null) {
                reply("Bad request").code(400);
            }
        }

        var validationResult = this.validator.validate(surveyData, this.surveySchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }
        
        var surveyResult = await this.orchestrator.createSurvey(surveyData);

        if(surveyResult == null) {
            // If generated ID was not unique, rather fail than overwrite data
            reply("Internal server error.").code(500);
        }

        reply(surveyResult);
    }

    async updateSurvey(surveyId, surveyJson, reply) {
        var surveyData = surveyJson;

        if(surveyData.id != null && surveyData.id != surveyId){
            reply("Bad request. Survey ID does not match route's survey ID.").code(400);
            return;
        }

        var validationResult = this.validator.validate(surveyData, this.surveySchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }

        var updateResult =  await this.orchestrator.updateSurvey(surveyId, surveyData);

        if(updateResult != null) {
            reply(updateResult);
        } 
        else {
            reply("Not found").code(404);
        }
    }

    async deleteSurvey(surveyId, reply) {
        var result = await this.orchestrator.deleteSurvey(surveyId);
        if(result){
            reply().code(200);
        }
        else {
            reply("Not found").code(404);
        }
    }

    setupRoutes(server) {
        var controller = this;

        // GET /surveys/{surveyId}
        server.route({
            method: 'GET',
            path: baseRoute + '/{surveyId}',
            handler: function(request, reply){
                var surveyId = encodeURIComponent(request.params.surveyId);
                var promise = controller.getSurvey(surveyId, reply);
                promise.then(
                    function(){
                        console.log("Request completed");
                    }, 
                    function(){
                        console.log("Error occurred");
                        reply().code(500);
                    });
            }
        });

        // GET /surveys?$breederId="example"
        server.route({
            method: 'GET',
            path: baseRoute,
            handler: function(request, reply) {
                var params = request.query;
                var breederId = params['breederId'];
                var promise = controller.getSurveysForBreeder(breederId, reply);
                promise.then(
                    function(){
                        console.log("Request completed");
                    }, 
                    function(){
                        console.log("Error occurred");
                        reply().code(500);
                    });
            }
        });

        // POST /surveys
        server.route({
            method: 'POST',
            path: baseRoute,
            handler: function(request, reply){
                var surveyJson = request.payload;
                var promise = controller.createSurvey(surveyJson, reply);
                promise.then(
                    function(){
                        console.log("Request completed");
                    }, 
                    function(){
                        console.log("Error occurred");
                        reply().code(500);
                    });
            }
        });

        // PATCH /surveys/{surveyId}
        server.route({
            method: 'PUT',
            path: baseRoute + '/{surveyId}',
            handler: function(request, reply){
                var surveyId = encodeURIComponent(request.params.surveyId);
                var surveyJson = request.payload;
                var promise = controller.updateSurvey(surveyId, surveyJson, reply);
                promise.then(
                    function(){
                        console.log("Request completed");
                    }, 
                    function(){
                        console.log("Error occurred");
                        reply().code(500);
                    });
            }
        });

        // DELETE /surveys/{surveyId}
        server.route({
            method: 'DELETE',
            path: baseRoute + '/{surveyId}',
            handler: function(request, reply){
                var surveyId = encodeURIComponent(request.params.surveyId);
                var promise = controller.deleteSurvey(surveyId, reply);
                promise.then(
                    function(){
                        console.log("Request completed");
                    }, 
                    function(){
                        console.log("Error occurred");
                        reply().code(500);
                    });
            }
        });
    }

}

module.exports = SurveyController;