const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html ; charset=utf-8')
  if (req.url === '/') {
    res.end('Hello Wórld')
  } else if (req.url === '/about') {
    res.end('About me')
  } else if (req.url === '/imagen.png') {
    fs.readFile('./FIRMA.png', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('Error')
      } else {
        res.setHeader('Content-Type', 'image/png') // Debe ocurrir aqui porque solo aqui se muestra la imagen
        res.end(data)
      }
    })
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server listening on port http://localhost:${desiredPort}`)
})
