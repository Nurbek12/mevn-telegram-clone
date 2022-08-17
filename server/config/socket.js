const Group = require('../models/Group');
const ActiveUsers = require('./activeUsers')
const au = new ActiveUsers()

module.exports = io => {
    io.on('connection', (socket) => {
        async function connectgroups(id){
            const grs = await Group.find({ members: { $in: [id] } });
            grs.forEach(g => socket.join(g.id))
        }

        socket.on('new-user-add', (nuser) => {
            if(!au.all().some(u => u.id === nuser)){
                au.push({
                    id: nuser,
                    socketId: socket.id
                })
                connectgroups(nuser)
            }
            io.emit('get-users', au.all())
        })

        socket.on('join-group', (id) => socket.join(id))

        socket.on('leave', (id) => socket.leave(id))

        socket.on('delete-chat', (data) => {
            const user = au.all().find(u => u.id === data.receiver)
            if(user) io.to(user.socketId).emit('deleted-chat', data)
        })

        socket.on('delete-user-group', (data) => io.to(data.id).emit('delete_user_group', data))

        socket.on('view-message', (data) => {
            const user = au.all().find(u => u.id === data.receiver)
            if(user) io.to(user.socketId).emit('user-view-message', data)
            else socket.broadcast.to(data.receiver).emit('user-view-message', data)
        })

        socket.on('me-typing', (data) => {
            const user = au.all().find(u => u.id === data.receiver)
            if(user) io.to(user.socketId).emit('user-typing', data)
            else socket.broadcast.to(data.chatId).emit('user-typing', data)
        })

        socket.on('send-message', (data) => {
            const user = au.all().find(u => u.id === data.id)
            if(user) io.to(user.socketId).emit('receive-message', data.message)
            else socket.broadcast.to(data.id).emit('receive-message', data.message)
        })

        socket.on('add-user-group', (data) => socket.broadcast.to(data.id).emit('add-user', data))

        socket.on('add-chat', (data) => {
            const user = au.all().find(u => u.id === data[1])
            if(user) io.to(user.socketId).emit('add-chat-user', data[0])
            else socket.broadcast.to(data[1]).emit('add-chat-user', data[0])
        })

        socket.on('disconnect', () => {
            au.remove(socket.id)
            io.emit('get-users', au.all())
        })
    })
}