const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors.map(e => e.message) })
  }

  return response.status(500).json({ error: 'something went wrong' })
}

module.exports = {
  errorHandler
}