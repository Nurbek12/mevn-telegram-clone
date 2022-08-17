const Chat = require('../models/Chat')
const Message = require('../models/Message')
const Group = require('../models/Group')
const User = require('../models/User')
const { GenerateUserColor, getTime } = require('../config/tools');

async function groupMessage(group, text){
    const message = await Message.create({
        sender: null,
        chatId: group._id,
        text: text,
        date: {
            day: getTime()[1],
            time: getTime()[0]
        },
    });
    return message
}

module.exports = {
    createChat: async (req, res) => {
        try{
            const newChat = await Chat.create({
                members: req.body.members,
                users: req.body.users
            })

            const resl = await Chat.findOne({ _id: newChat })
            .populate('users', '_id name avatar email usercolor username bio');
            res.status(200).json({ success: true, result: resl })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    getChatById: async (req, res) => {
        try{
            const chats = await Chat.find({
                members: { $in: [req.params.id] }
            })
            .populate('users', '_id name avatar email usercolor username bio')
            const groups = await Group.find({
                members: { $in: [req.params.id] }
            })
            .populate('users', '_id name avatar email usercolor username bio')
            const lists = [...chats, ...groups];
            for(let i=0;i<lists.length; i++){
                const messages = await Message.find({ chatId: lists[i]._id })
                .populate('sender', '_id name avatar email usercolor username bio')
                lists[i] = {...lists[i]._doc, messages}
                if(lists[i].admin) lists[i].group = true
            }
            res.status(200).json({chats: lists});
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    getGroupById:  async (req, res) => {
        try{
            const data = await Group.findById(req.params.id)
            .populate('users', '_id name avatar email usercolor username bio')
            res.status(200).json({data, group: true});
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    createGroup: async (req, res) => {
        try{
            const color = GenerateUserColor();
            const group = await Group.create({
                name: req.body.name,
                admin: req.body.admin,
                usercolor: color,
                users: [req.user._id,],
                members: [req.body.admin,]
            });
    
            await groupMessage(group, 'Группа создан')
            const resl = await Group.findById(group._id)
            .populate('users', '_id name avatar usercolor');
    
            res.status(200).json({ success: true, group: resl })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    updateGroup: async (req, res) => {
        try{
            const group = await Group.findById(req.params.id);
            if(group.admin === req.user.id){
                await group.update({$set: req.body});
                res.status(200).json({ success: true })
            }else{
                res.json({ success: false, message: 'you not admin' })
            }
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    joinGroup: async (req, res) => {
        try{
            const messages = await Message.find({ chatId: req.params.id })
            .populate('sender', '_id name avatar email usercolor username bio')
            await Group.findByIdAndUpdate(req.params.id, { $push: { users: req.body.id, members: req.body.id } })
            .populate('users', '_id name email avatar usercolor username bio')
            .exec(async (_, group) => {
                const message = await groupMessage(group, `${req.body.name} теперь в группе`)
                return res.status(200).json({ success: true, message, data: {...group._doc, messages: messages, group: true} })
            })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    leaveGroup:  async (req, res) => {
        try{
            const group = await Group.findByIdAndUpdate(req.params.id, {
                $pull: { users: req.body.userid, members: req.body.userid },
            })
            const message = await groupMessage(group, `${req.body.name} покинкул(а) группу`)
            res.status(200).json({ success: true, message, })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    findChat: async (req, res) => {
        try{
            const pt = new RegExp('^'+req.params.txt)
            const users = await User.find({ name: { $regex: pt } })
            const groups = await Group.find({ name: { $regex: pt } })
            .populate('users', '_id name avatar email usercolor');
            for(let i=0;i<groups.length; i++){
                const messages = await Message.find({ chatId: groups[i]._id })
                .populate('sender', '_id name avatar usercolor');
                groups[i] = {...groups[i]._doc, messages, group: true}
            }
            res.status(200).json({ success: true, resl: [...users, ...groups] })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    deleteChat: async (req, res) => {
        try{
            await Chat.findByIdAndDelete({_id: req.params.id});
            await Message.deleteMany({ chatId: req.params.id });
            res.status(200).json({ success: true })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    }
}