'use strict';

const Hapi = require('hapi');
const Setup = require('./setup')
const BreederController = require('./controllers/breederController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');
const Cors = require('hapi-cors');

// Start preparing a server
const server = new Hapi.Server();
server.connection(
    { 
        port: process.env.NODE_PORT || 3000, 
        host: process.env.HOST_URL || 'localhost',
        routes: {
            cors: true
        }
    });

// TODO: Remove or make an intro page for the API
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

// Call the "IoC" to set up all the routes on the server
var setup = new Setup(server);

// Start the server
server.register([
    {
        register: Cors,
        options: {
            origins: ['http://127.0.0.1:54680']
        }
    }], function(err){
    server.start(function(err){
        if(err) throw err;

		console.log(server.info.uri);
	});
});