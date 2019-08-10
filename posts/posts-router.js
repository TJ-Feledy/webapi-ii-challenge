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

module.exports = router