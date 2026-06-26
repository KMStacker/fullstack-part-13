const Sequelize = require('sequelize')
const { DATABASE_URL, TESTING } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')


const connectionUrl = process.env.TESTING === 'true' 
  ? process.env.TEST_DATABASE_URL 
  : DATABASE_URL

const sequelize = new Sequelize(connectionUrl, {
  dialect: 'postgres',
  dialectOptions: {},
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }