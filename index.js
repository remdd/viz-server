require('dotenv').config()
const app = require('express')()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const cors = require('cors')

const corsOptions = {
  origin: process.env.CONTROLLER_URL
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

let data = {
  text1: 'init',
  font: 'bungee'
}

app.post('/data', (req, res) => {
  // console.log(`received: ${JSON.stringify(req.body)}`)
  data = Object.assign(data, req.body)

  // console.log(`emitting ${JSON.stringify(data)}`)
  io.sockets.emit('data', data)

  res.send(data)
})

const io = require('socket.io')(http, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log(`connected ${socket.id}`);
  socket.emit('data', data)

  socket.on('disconnect', (reason) => {
    console.log(`disconnected - reason: ${reason}`);
  })
})

http.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
  console.log(`client: ${process.env.CLIENT_URL}`)
  console.log(`controller: ${process.env.CONTROLLER_URL}`)
})
