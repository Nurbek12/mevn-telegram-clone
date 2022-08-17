const passport = require('passport');
const multer = require('multer');
const router = require('express').Router();
const path = require('path');
const User = require('../models/User');
const Group = require('../models/Group');
const fs = require('fs');

var ImageKit = require("imagekit");
var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUB_KEY,
    privateKey : process.env.IMAGEKIT_PPV_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_END
});

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, path.resolve(__dirname, '../', 'upload'))
    },
    filename: (req, _, cb) => {
        cb(null, req.body.filename);
    }
});
const upload = multer({ storage: storage })

router.put('/useravatar/:id', 
    passport.authenticate('jwt', {session: true}), 
    upload.single('image'), async (req, res) => {
    try{
        fs.readFile(path.join(__dirname, '../', 'upload', req.body.filename), function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            imagekit.upload({
              file : data, //required
              fileName : req.body.filename, //required
              folder: '/tg-clone/'
            }, async function(error, result) {
              if(error) console.log(error);
              else {
                await User.findByIdAndUpdate(
                    { _id: req.params.id}, 
                    { $push: { avatar: result.url },});
                res.status(200).json({ success: true })
              };
            });
          });
    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, message: 'Error' })
    }
});

router.put('/useravatar/delete/:id', passport.authenticate('jwt', {session: true}), async (req, res) => {
    try{
        await User.findByIdAndUpdate({ _id: req.params.id}, {
            $pull: { avatar: req.body.filename }
        })
        res.status(200).json({ success: true })
    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, message: 'Error' })
    }
})

router.put('/groupavatar/:id', 
    passport.authenticate('jwt', {session: true}), 
    upload.single('image'), async (req, res) => {
    try{
        if(req.body.admin === req.user.id){
            fs.readFile(path.join(__dirname, '../', 'upload', req.body.filename), function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
                imagekit.upload({
                file : data, //required
                fileName : req.body.filename, //required
                folder: '/tg-clone/'
                }, async function(error, result) {
                    if(error) console.log(error);
                    else {
                        await Group.findByIdAndUpdate(req.params.id, { avatar: [result.url] });
                        res.status(200).json({ success: true })
                    }
                });
            });
        }else{
            res.json({ success: false, message: 'you not admin' })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, message: 'Error' })
    }
});

router.post('/message/photo', passport.authenticate('jwt', {session: true}), 
    upload.single('image'), async (req, res) => {
        try{
            fs.readFile(path.join(__dirname, '../', 'upload', req.body.filename), function(err, data) {
                if (err) throw err; // Fail if the file can't be read.
                imagekit.upload({
                  file : data, //required
                  fileName : req.body.filename, //required
                  folder: '/tg-clone/'
                }, async function(error, result) {
                  if(error) console.log(error);
                  else res.status(200).json({ success: true, result })
                });
              });
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
});

module.exports = router;