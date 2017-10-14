'use strict';

const Hapi = require('hapi');
const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const UserController = require('./controllers/userController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');
const SurveyOrchestrator = require('./orchestrators/surveyOrchestrator');
const UserOrchestrator = require('./orchestrators/userOrchestrator');
const Mongoose = require('mongoose');
const dbConnection = "http://localhost:27017/test";

// A really bad fake IoC container
class Setup {

    constructor(server) {
        this.setupServer(server);
    }

    setupServer(server) {
        this.setupControllers(server);
    }

    setupControllers(server) {
        
        Mongoose.connect(dbConnection);

        this.breederOrchestrator = new BreederOrchestrator();
        this.breederController = new BreederController(this.breederOrchestrator);
        this.breederController.setupRoutes(server);

        this.userOrchestrator = new UserOrchestrator();
        this.userController = new UserController(this.userOrchestrator);
        this.userController.setupRoutes(server);

        this.surveyOrchestrator = new SurveyOrchestrator();
        this.surveyController = new SurveyController(this.surveyOrchestrator, this.breederOrchestrator, this.userOrchestrator);
        this.surveyController.setupRoutes(server);
        
    }

}

module.exports = Setup;