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

        this.breederController.setupRoutes(server);
    }

}

module.exports = Setup;