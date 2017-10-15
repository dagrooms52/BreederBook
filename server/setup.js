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
const dbConnection = "mongodb://172.25.0.0/test";

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
        var dbPromise = Mongoose.createConnection(dbConnection, {useMongoClient: true});

        this.breederOrchestrator = new BreederOrchestrator(dbPromise);
        this.breederController = new BreederController(this.breederOrchestrator);
        this.breederController.setupRoutes(server);

        this.userOrchestrator = new UserOrchestrator(dbPromise);
        this.userController = new UserController(this.userOrchestrator);
        this.userController.setupRoutes(server);

        this.surveyOrchestrator = new SurveyOrchestrator(dbPromise);
        this.surveyController = new SurveyController(this.surveyOrchestrator, this.breederOrchestrator, this.userOrchestrator);
        this.surveyController.setupRoutes(server);

        this.reportOrchestrator = new ReportOrchestrator(this.breederOrchestrator, this.surveyOrchestrator);
        this.reportController = new ReportController(this.reportOrchestrator);
        this.reportController.setupRoutes(server);
        
    }

}

module.exports = Setup;