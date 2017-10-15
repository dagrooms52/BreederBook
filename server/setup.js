'use strict';

const Hapi = require('hapi');
const BreederController = require('./controllers/breederController');
const SurveyController = require('./controllers/surveyController');
const UserController = require('./controllers/userController');
const ReportController = require('./controllers/reportController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');
const SurveyOrchestrator = require('./orchestrators/surveyOrchestrator');
const UserOrchestrator = require('./orchestrators/userOrchestrator');
const ReportOrchestrator = require('./orchestrators/reportOrchestrator');
const Mongoose = require('mongoose');
const dbConnection = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

// A really bad fake IoC container
class Setup {

    constructor(server) {
        this.setupServer(server);
    }

    setupServer(server) {
        this.setupControllers(server);
    }

    setupControllers(server) {
        
        Mongoose.Promise = global.Promise;

        this.breederOrchestrator = new BreederOrchestrator(dbConnection);
        this.breederController = new BreederController(this.breederOrchestrator);
        this.breederController.setupRoutes(server);

        this.userOrchestrator = new UserOrchestrator(dbConnection);
        this.userController = new UserController(this.userOrchestrator);
        this.userController.setupRoutes(server);

        this.surveyOrchestrator = new SurveyOrchestrator(dbConnection);
        this.surveyController = new SurveyController(this.surveyOrchestrator, this.breederOrchestrator, this.userOrchestrator);
        this.surveyController.setupRoutes(server);

        this.reportOrchestrator = new ReportOrchestrator(this.breederOrchestrator, this.surveyOrchestrator);
        this.reportController = new ReportController(this.reportOrchestrator);
        this.reportController.setupRoutes(server);
        
    }

}

module.exports = Setup;