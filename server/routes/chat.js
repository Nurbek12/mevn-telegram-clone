const router = require('express').Router()
const passport = require('passport')
const { createChat, getChatById, 
        getGroupById, createGroup,
        updateGroup, joinGroup,
        leaveGroup, findChat, deleteChat } = require('../controllers/chats')
const passportauth = passport.authenticate('jwt', { session: true })

router.post('/', passportauth, createChat)
router.get('/:id', passportauth, getChatById)
router.get('/group/get/:id', passportauth, getGroupById)
router.post('/create/group', passportauth, createGroup)
router.put('/update/group/:id', passportauth, updateGroup)
router.put('/join/group/:id', passportauth, joinGroup)
router.put('/unjoin/group/:id', passportauth, leaveGroup)
router.get('/findchat/:txt', passportauth, findChat)
router.delete('/delete/chat/:id', passportauth, deleteChat)

module.exports = router