'use strict';

const Hapi = require('hapi');
const Setup = require('./setup')
const BreederController = require('./controllers/breederController');
const BreederOrchestrator = require('./orchestrators/breederOrchestrator');
const Cors = require('hapi-cors');

// Start preparing a server
const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT || 3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('BreederBook Home Page');
    }
});

// Call the "IoC" to set up all the routes on the server
var setup = new Setup(server);

// Start the server
server.register([
    {
        register: Cors,
    }], function(err){
    server.start(function(err){
        if(err) throw err;
	console.log(server.info.uri);
    });
});
