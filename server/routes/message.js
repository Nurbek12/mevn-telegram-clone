const router = require('express').Router()
const { createMessage, getMessagesById,
    viewMessage } = require('../controllers/messages')
const passport = require('passport')
const passportauth = passport.authenticate('jwt', { session: true })

router.post('/', passportauth, createMessage)
router.get('/:id', passportauth, getMessagesById)
router.put('/view/:id', passportauth, viewMessage)

module.exports = router