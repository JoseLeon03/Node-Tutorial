const http = require('node:http')

const dittoJSON = require('./pokemon/ditto.json')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          return res.end(JSON.stringify(dittoJSON))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end('Not found')
      }
    case 'POST':
      switch (url) {
        case '/pokemon':{
          let body = ''
          // escuchar el evento data
          req.on('data', (chunk) => {
            body += chunk.toString() // Para cada informacion que recibe la concatenamos al body
          })
          req.on('end', () => { // Se ejecuta cuando termina de recibir la informacion
            const data = JSON.parse(body)
            // llamar a una base de datos para guardar la informacion
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify(data))
          })
          break
        }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end('Not found')
      }
  }
}
const server = http.createServer(processRequest)

server.listen(3000, () => {
  console.log('server listening on port http://localhost:3000')
})
