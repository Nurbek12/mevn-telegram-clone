const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const passport = require('passport')
const app = express()
const httpserver = require('http').createServer(app)
const { Server } = require('socket.io')

require('dotenv').config();

const io = new Server(httpserver
    // ,{cors: { origin: process.env.CLIENTSOCKETURL,credentials: true}}
    )

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => { console.log('Database connected...') })
.catch(err => { console.log('Error', err) })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'upload')))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(passport.initialize())

require('./config/passport')(passport)

app.use('/chat', require('./routes/chat.js'))
app.use('/users', require('./routes/user.js'))
app.use('/upload', require('./routes/upload.js'))
app.use('/message', require('./routes/message.js'))

require('./config/socket')(io)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'dist','index.html'))
});

httpserver.listen(process.env.PORT, () => console.log('Server start...'))