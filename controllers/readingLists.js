const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')

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

module.exports = router