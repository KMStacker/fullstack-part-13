const Sequelize = require('sequelize')
const { DATABASE_URL, TESTING } = require('./config')


const connectionUrl = process.env.TESTING === 'true' 
  ? process.env.TEST_DATABASE_URL 
  : DATABASE_URL

const sequelize = new Sequelize(connectionUrl, {
  dialect: 'postgres',
  dialectOptions: {},
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }