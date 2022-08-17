const Message = require('../models/Message')

module.exports = {
    createMessage: async (req, res) => {
        try{
            const { chatId, sender, text, date, image } = req.body;
            const message = await Message.create({
                sender,
                text,
                date,
                chatId,
                image
            })
            const resl = await Message.findById(message._id)
            .populate('sender', '_id name avatar usercolor email bio username')
            res.status(200).json({ success: true, message: resl, })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    getMessagesById: async (req, res) => {
        try{
            const messages = await Message.find({ chatId: req.params.id })
            .populate('sender', '_id name avatar usercolor email bio username')
            res.status(200).json({ success: true, messages, })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    },
    viewMessage: async (req, res) => {
        try{
            await Message.findByIdAndUpdate({ _id: req.params.id }, { view: true })
            res.status(200).json({ success: true, })
        }catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Error' })
        }
    }
}