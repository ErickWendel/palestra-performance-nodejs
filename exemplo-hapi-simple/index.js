
const MongoJS = require('mongojs')
const db = MongoJS('mongodb://localhost/performance', ['heroes'])
const { promisifyAll } = require('bluebird')
const heroesDb = promisifyAll(db.heroes)
const winston = require('winston')
const log = (msg) => winston.log('info', msg)
db.on('error', (err) => log('database error', err))
db.on('connect', () => log('database connected'))
const Hapi = require('hapi')
const app = new Hapi.Server()
app.connection({ port: 4000, host: 'localhost'})
let countOfRequests = 0
app.route([{
    path: '/',
    method: 'GET',
    handler: async (req, reply) => {
        countOfRequests ++
        log(`request ${countOfRequests} id: ${req.id}` )
        return await reply(heroesDb.findAsync())
    }
}])

app.start(() => log(`hapi running at ${app.info.uri}`))