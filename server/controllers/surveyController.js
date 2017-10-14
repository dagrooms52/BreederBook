'use strict';

const Hapi = require('hapi');
const SurveyOrchestrator = require('../orchestrators/SurveyOrchestrator');
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

    getSurvey(surveyId, reply) {
        var surveyResult = this.orchestrator.getSurvey(surveyId);

        if(surveyResult == null){
            reply("Not found").code(404);
        }
        else {
            reply(JSON.stringify(surveyResult));
        }        
    }
    
    // TODO: Make sure the breederId and userId exist in the system
    createSurvey(surveyJson, reply) {
        
        // Validate that the referenced resources exist
        var referencedBreeder = this.breederOrchestrator.getBreeder(survey.breederId);
        var referencedUser = this.userOrchestrator.getUser(surveyData.userId);

        if (referencedBreeder == null || referencedUser == null) {
            reply("Bad request").code(400);
            return;
        }

        var surveyData = JSON.parse(surveyJson);

        var validationResult = this.validator.validate(surveyData, this.surveySchema);
        if (!validationResult.valid) {
            console.log(validationResult.errors)
            reply("Bad request").code(400);
            return;
        }
        
        var surveyResult = this.orchestrator.createSurvey(surveyData);

        if(surveyResult == null) {
            // If generated ID was not unique, rather fail than overwrite data
            reply("Internal server error.").code(500);
        }

        reply(JSON.stringify(surveyResult));
    }

    updateSurvey(surveyId, surveyJson, reply) {
        var surveyData = JSON.parse(surveyJson);

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

        var updateResult =  this.orchestrator.updateSurvey(surveyId, surveyData);

        if(updateResult) {
            reply().code(200);
        } 
        else {
            reply("Not found").code(404);
        }
    }

    deleteSurvey(surveyId, reply) {
        this.orchestrator.deleteSurvey(surveyId);
        reply().code(200);
    }

    setupRoutes(server) {
        var controller = this;

        // GET /surveys/{surveyId}
        server.route({
            method: 'GET',
            path: baseRoute + '/{surveyId}',
            handler: function(request, reply){
                var surveyId = encodeURIComponent(request.params.surveyId);
                controller.getSurvey(surveyId, reply);
            }
        });

        // POST /surveys
        server.route({
            method: 'POST',
            path: baseRoute,
            handler: function(request, reply){
                var surveyJson = request.payload;
                controller.createSurvey(surveyJson, reply)
            }
        });

        // PATCH /surveys/{surveyId}
        server.route({
            method: 'PUT',
            path: baseRoute + '/{surveyId}',
            handler: function(request, reply){
                var surveyId = encodeURIComponent(request.params.surveyId);
                var surveyJson = request.payload;
                controller.updateSurvey(surveyId, surveyJson, reply)
            }
        });

        // DELETE /surveys/{surveyId}
        server.route({
            method: 'DELETE',
            path: baseRoute + '/{surveyId}',
            handler: function(request, reply){
                var surveyId = encodeURIComponent(request.params.surveyId);
                controller.deleteSurvey(surveyId, reply);
            }
        });
    }

}

module.exports = SurveyController;