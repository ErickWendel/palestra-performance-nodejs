const hapi = require('hapi');
const http2 = require('http2');
const fs = require('fs');
const winston = require('winston')
const log = (msg) => winston.log('info', msg)
const options = {
    key: fs.readFileSync('certificates/server.key'),
    cert: fs.readFileSync('certificates/server.crt')
};
const inert = require('inert')
const server = new hapi.Server();
let countOfRequests = 0
server.connection({
    listener: http2.createServer(options),
    host: 'localhost',
    port: 3000,
    tls: true
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
