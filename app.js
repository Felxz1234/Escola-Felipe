const express = require("express")
const app = express()
const path = require('path')
const router = require('./rotas/rotas')
const mongoose = require('mongoose')
const rotaAluno = require('./rotaAluno/rotasAlunos')
const rotaProf = require('./rotaProfe/routerProfe')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const dotenv = require('dotenv').config();
let port = process.env.PORT || 8080

const server = app.listen(port,()=>{
    console.log('Server Running')
})

const io = socketIO(server)
const messages = []


mongoose.connect('mongodb://localhost/logins',(db)=>{
    console.log('conectado')
})

app.set('views',path.join(__dirname,'publico'))
app.set('view engine','ejs')
router.get('/',express.static(path.join(__dirname,'inicio')))
router.get('/get',express.static(path.join(__dirname,'chat')))

io.on('connection',(socket)=>{
    console.log('new connection')
    socket.emit('update_messages',messages)
    socket.on('new_message',(data)=>{
        messages.push(data)

        io.emit('update_messages',messages)
    })
})


app.use(bodyParser.urlencoded({extended:true}))
app.use('/',express.json(),router)
app.use('/',rotaAluno)
app.use('/',rotaProf)


