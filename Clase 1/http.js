const http = require('node:http')
const { findAvailablePort } = require('./free-port')

const server = http.createServer((req, res) => {
  res.end('Hello World') // Esto se ejecuta cada vez que se hace una petición al servidor (request)
})

findAvailablePort(3000).then(port => {
  server.listen(port, () => {
    console.log(`Server listening on port http://localhost:${server.address().port}`)
  })
})
