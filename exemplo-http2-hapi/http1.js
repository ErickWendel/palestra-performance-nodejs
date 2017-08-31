const hapi = require('hapi');
const winston = require('winston')
const log = (msg) => winston.log('info', msg)
const inert = require('inert')
const server = new hapi.Server();
const fs = require('fs');
const http = require('http')
let countOfRequests = 0
const options = {
    key: fs.readFileSync('certificates/server.key'),
    cert: fs.readFileSync('certificates/server.crt')
};
server.connection({ 
    host: 'localhost',
    port: 4000,
    tls: options

});
server.register(inert, () => {

    server.route([{
        
        method: 'GET',
        path: '/',
        handler: async (req, reply) => {
            countOfRequests++
            log(`request ${countOfRequests} id: ${req.id}`) 
            return reply.file('./public/index.html')
        }
    },
    {    // Other assets If you have
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: './public',
                listing: false,
                index: true
            }
        }
    }]);
})

server.start((err) => log(`Server running at: ${server.info.uri}`));
