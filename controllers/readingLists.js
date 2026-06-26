const router = require('express').Router()
const { ReadingList, Blog, User, Session } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

      const session = await Session.findOne({
        where: { token: authorization.substring(7) },
        include: { model: User }
      })
      
      if (!session || session.user.disabled) {
        return res.status(401).json({ error: 'no token in session or user disabled' })
      }

    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (!blogId) {
      return res.status(400).json({ error: 'both blogId and userId are required' })
    }

    const blog = await Blog.findByPk(blogId)
    const user = await User.findByPk(userId)

    if (!blog || !user) {
      return res.status(404).json({ error: 'blog or user or both not found' })
    }

    const entry = await ReadingList.create({
      blog_id: blogId,
      user_id: userId
    })

    return res.json(entry)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const entry = await ReadingList.findByPk(req.params.id)

    if (!entry) {
      return res.status(404).json({ error: 'not found in reading list' })
    }

    if (entry.user_id !== req.decodedToken.id) {
      return res.status(401).json({ error: 'this is not your reading list' })
    }

    entry.read = req.body.read
    await entry.save()
    return res.json(entry)
  } catch (error) {
    next(error)
  }
})

module.exports = router