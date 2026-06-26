const router = require('express').Router()
const { Session } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const tokenString = authorization.substring(7)
      req.decodedToken = jwt.verify(tokenString, SECRET)
      const session = await Session.findOne({ where: { token: tokenString } })
      if (!session) {
        return res.status(401).json({ error: 'session invalid' })
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    await Session.destroy({
      where: {
        userId: req.decodedToken.id
      }
    })
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router