import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()
const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})
const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})
// Normalmente deberia usar uuid pero aca no importa
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 content TEXT,
 user TEXT
 )
  `)

io.on('connection', async (socket) => {
  console.log('un usuario se ha conectado')
  socket.on('disconnect', () => {
    console.log('un usuario se ha desconectado')
  })
  socket.on('chat message', async (msg) => { // Recibe el mensaje del cliente
    let result
    const username = socket.handshake.auth.username ?? 'anonymous' // Recupera el username del cliente
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user)  VALUES (:message, :username)',
        args: { message: msg, username }
      })
      console.log(result)
    } catch (e) {
      console.error(e)
      return
    }
    io.emit('chat message', msg, result.lastInsertRowid.toString(), username) // Envia el mensaje a todos los clientes conectados
  })
  if (!socket.recovered) { // Recuperar mensajes sin conexion
    try {
      const results = await db.execute({
        sql: 'SELECT * FROM messages where id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0] // Este offset lo recibimos de index.html
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString(), row.user)
      })
    } catch (e) {
      console.error(e)
    }
  }
})
app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html') // Envia el archivo index.html al cliente para cargarlo
})

server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`)
})
