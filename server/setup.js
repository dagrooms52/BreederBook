'use strict';

const Hapi = require('hapi');
const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const UserController = require('./controllers/userController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');
const SurveyOrchestrator = require('./orchestrators/surveyOrchestrator');

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
        this.breederController = new BreederController(new BreederOrchestrator());
        this.breederController.setupRoutes(server);

        this.surveyController = new SurveyController(new SurveyOrchestrator());
        this.surveyController.setupRoutes(server);

        this.userController = new UserController();
        this.userController.setupRoutes(server);
    }

}

module.exports = Setup;