const MongoJS = require('mongojs')
const db = MongoJS('mongodb://localhost/performance', ['heroes'])
const { promisifyAll } = require('bluebird')
const heroesDb = promisifyAll(db.heroes)
const winston = require('winston')
const log = (msg) => winston.log('info', msg)
db.on('error', (err) => log('database error', err))
db.on('connect', () => log('database connected'))
const Hapi = require('hapi')
const app = new Hapi.Server({
    cache: [

        {
            name: 'redisCache',
            engine: require('catbox-redis'),
            host: '127.0.0.1',
            partition: 'cache'
        }
    ]
})
app.connection({ port: 6000, host: 'localhost' })

const findAsync = (next) => heroesDb.findAsync().then(res => next(null, res))
app.method('findAsync', findAsync, {
    cache: {
        cache: 'redisCache',
        expiresIn: 30 * 10000,
        generateTimeout: 100
    }
});



// app.route({
//     path: '/hapi/{ttl?}',
//     method: 'GET',
//     handler: function (request, reply) {

//         const response = reply({ be: 'hapi' });
//         if (request.params.ttl) {
//             response.ttl(request.params.ttl);
//         }
//     },
//     config: {
//         cache: {
//             expiresIn: 30 * 1000,
//             privacy: 'private'
//         }
//     }
// });

app.route([{
    path: '/',
    method: 'GET',
    handler: (req, reply) => {
        app.methods.findAsync((err, res, cached, report) => {
            const lastModified = cached ? new Date(cached.stored) : new Date();
            log(`ultimo cache: ${lastModified.toLocaleString()}`)
            if (err) return reply('deu rum' + err)
            return reply(res).header('last-modified', lastModified.toUTCString());
        })
    }
}])

app.start((err) => log(`hapi running at ${app.info.uri}`))