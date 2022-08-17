const router = require('express').Router()
const passport = require('passport')
const { getAllUsers, beginverify, getprofile, verifyCode, updateprofile, getuser } = require('../controllers/users')
const passportauth = passport.authenticate('jwt', { session: true })

router.post('/verifycode', verifyCode)
router.post('/beginverify', beginverify)
router.get('/profile', passportauth, getprofile)
router.get('/finduser/:id', passportauth, getuser)
router.get('/getallusers', passportauth, getAllUsers)
router.put('/update/:id', passportauth, updateprofile)

module.exports = router