const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { sendEmail, GenerateCode } = require('../config/emailer')
const { GenerateUserColor } = require('../config/tools');

module.exports = {
    getprofile: async (req, res) => {
        res.status(200).json({success: true, user: req.user});
    },
    verifyCode: async (req, res) => {
        try{
            const { code, email } = req.body
            if(!email || !code){
                return res.status(401).json({ message: 'Заполните все полее', success: false })
            }else{
                const user = await User.findOne({ email })
                if(user){
                    await bcrypt.compare(code, user.verifycode).then((valid) => {
                        if(valid){
                            user.verifycode = '';
                            user.save();
                            const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET, { expiresIn: '30d' })
                            const { verifycode, ...userdata } = user._doc;
                            sendEmail('rustamovnurbek02@gmail.com', `${user.email}, user connected to telegram`)
                            return res.status(200).json({ success: true, user: {...userdata}, token: `Bearer ${token}` })
                        }else{
                            return res.json({ success: false, message: 'Не верной парол' })
                        }
                    })
                }else{
                    return res.json({ success: false, message: 'Такой ползовател не найден' })
                }
            }
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    beginverify: async (req, res) => {
        const code = GenerateCode()
        let profile
        try{
            if(!req.body.email){
                return res.status(401).json({ message: 'Заполните все полее', success: false })
            }else{
                const user = await User.findOne({email: req.body.email})
                const salt = await bcrypt.genSalt(10)
                const hashcode = await bcrypt.hash(code, salt)
    
                if(user){
                    user.verifycode = hashcode;
                    await user.save();
                    profile = user
                }else{
                    const color = GenerateUserColor();
                    profile = await User.create({
                        email: req.body.email,
                        verifycode: hashcode,
                        usercolor: color
                    })
                }
//                 console.log(code)
                sendEmail(req.body.email, code)
                res.status(200).json({ success: true, message: 'Код отправлено', _id: profile._id, register: profile.registered })
            }
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    updateprofile: async (req, res) => {
        try{
            await User.findByIdAndUpdate({_id: req.params.id}, { $set: req.body })
            const user = await User.findOne({ _id: req.params.id });
            res.status(200).json({ success: true, message: 'Updated successfully', user })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    getuser: async (req, res) => {
        try{
            const user = await User.findById({ _id: req.params.id })
            .select(`-verifycode ${req.user.id===req.params.id?'':' -registered -contacts'}`);
            if(user){
                return res.status(200).json({ success: true, data: user, })
            }else{
                return res.status(404).json({ success: false, message: 'Такой ползовател не найден' })
            }
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    getAllUsers: async (req, res) => {
        try{
            const users = await User.find();
    
            res.status(200).json({ users })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    }
}
