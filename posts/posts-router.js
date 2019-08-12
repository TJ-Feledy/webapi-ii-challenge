const express = require('express')
const db = require('../data/db.js')
const router = express.Router()

router.post('/', async (req, res) => {
  const { title, contents } = req.body

  if (!title || !contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' })
  }else {
    try {
      const hub = await db.insert(req.body)
      res.status(201).json(hub)
    }catch {
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      })
    }
  }
})

router.post("/:id/comments", async (req, res) => {
  const commentInfo = {...req.body, post_id: req.params.id}
  const {id} = req.params

  if (!id) {
    res.status(404).json({
      message: 'The post with the specified ID does not exist.'
    })
  }else if (!req.body.text) {
    res.status(400).json({
      errorMessage: 'Please provide text for the comment.'
    })
  }else {
    try {
      const savedComment = await db.insertComment(commentInfo)
      res.status(201).json(savedComment)
    }catch (error) {
      console.log(error)
      res.status(500).json({
        error: 'There was an error while saving the comment to the database.'
      })
    }
  }
})

router.get('/', async (req, res) => {
  try {
    const posts = await db.find()
    res.status(200).json(posts)
  }
  catch {
    res.status(500).json({
      error: 'The posts information could not be retrieved.'
    })
  }
})

router.get('/:id/', async (req, res) => {
  const post = await db.findById(req.params.id)

  if (post.length === 0) {
    res.status(404).json({
      message: 'The post with the specified ID does not exist.'
    })
  }else {
    try {
      res.status(200).json(post)
    }
    catch {
      res.status(500).json({
        error: 'The post information could not be retrieved.'
      })
    }
  }
})

router.get('/:id/comments/', async (req, res) => {
  const postComments = await db.findPostComments(req.params.id)
  const post = await db.findById(req.params.id)
  if (post.length === 0) {
    res.status(404).json({
      message: 'The post with the specified ID does not exist.'
    })
  }else {
    try {
      res.status(200).json(postComments)
    }
    catch {
      res.status(500).json({
        error: 'The comments information could not be retrieved.'
      })
    }
  }
})

router.delete('/:id/', async (req, res) => {
  
  try {
    const postRemove = await db.remove(req.params.id)
    if (postRemove > 0) {
      res.status(200).json({
        message: 'The post was Removed'
      })
      }else {
      res.status(404).json({
        message: 'The post with the specified ID does not exist.'
      })
    }
  }
  catch {
    res.status(500).json({
      error: 'The post could not be removed.'
    })
  }
})

router.put('/:id/', async (req, res) => {
  const post = await db.findById(req.params.id)
  
  if (post.length === 0) {
    res.status(404).json({
      message: 'The post with the specified ID does not exist.'
    })
  }
  else if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    })
  }
  else {
    try {
      const postUpdate = await db.update(req.params.id, req.body)
      res.status(200).json(postUpdate)
    }
    catch {
      res.status(500).json({
        error: 'The post information could not be modified.'
      })
    }
  }
})
module.exports = router