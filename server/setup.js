'use strict';

const Hapi = require('hapi');
const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');

// A really bad fake IoC container
class Setup {

    constructor(server) {
        this.breederController = null;

        this.setupServer(server);
    }

    setupServer(server) {
        this.setupControllers(server);
    }

    setupControllers(server) {
        this.breederController = new BreederController(server, new BreederOrchestrator());

        this.setupBreederRoutes(server, this.breederController);
    }

    setupBreederRoutes(server, controller) {

        var baseRoute = "/breeders";

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

module.exports = Setup;