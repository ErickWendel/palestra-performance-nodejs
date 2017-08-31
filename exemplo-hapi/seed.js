const MongoJS = require('mongojs')
const db = MongoJS('mongodb://localhost/performance', ['heroes'])
const { promisifyAll } = require('bluebird')
const bulk = promisifyAll(db.heroes.initializeOrderedBulkOp())
const faker = require('faker')
db.on('error', (err) => console.log('database error', err))
db.on('connect', () => console.log('database connected'))

async function run() {
    console.time('bulkInsert')
    for (let i = 0; i <= 999; i++) {
        const name = faker.name.findName();
        const email = faker.internet.email();
        const company = faker.company.companyName();
        const accountName = faker.finance.accountName();
        bulk.insert({ name, email, company, accountName })
    }

    const { nInserted } = await bulk.executeAsync()
    console.log(`Done! inserted: ${nInserted} items`)
    console.timeEnd('bulkInsert')
    process.exit(0)
}
run()
