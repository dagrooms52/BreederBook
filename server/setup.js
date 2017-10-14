'use strict';

const Hapi = require('hapi');
const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const UserController = require('./controllers/userController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');
const SurveyOrchestrator = require('./orchestrators/surveyOrchestrator');
const UserOrchestrator = require('./orchestrators/userOrchestrator');

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
        
        this.breederOrchestrator = new BreederOrchestrator();
        this.breederController = new BreederController(this.breederOrchestrator);
        this.breederController.setupRoutes(server);

        this.userOrchestrator = new UserOrchestrator();
        this.userController = new UserController(this.userOrchestrator);
        this.userController.setupRoutes(server);

        this.surveyOrchestrator = new SurveyOrchestrator(this.breederOrchestrator, this.userOrchestrator);
        this.surveyController = new SurveyController(this.surveyOrchestrator);
        this.surveyController.setupRoutes(server);

        
    }

}

module.exports = Setup;