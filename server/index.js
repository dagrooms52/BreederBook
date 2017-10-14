'use strict';

const Hapi = require('hapi');
const Setup = require('./setup')

// Start preparing a server
const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

// TODO: Remove or make an intro page for the API
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

// Call the "IoC" to set up all the routes on the server
Setup.setupServer(server);

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});