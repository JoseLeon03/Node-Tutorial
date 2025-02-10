const express = require('express')
const app = express() // Crear una instancia de express
const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000
// Con express es menos imperativo, es mas declarativo

app.use(express.json()) // Hace lo mismo que el de abajo, pero es mas declarativo

app.use((req, res, next) => { // Middleware
  // trackear la request a la base de datos
  // revisar si el usuario tiene cookies
  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()
  // Solo llegan requests que son POST y que tienen un content-type de application/json
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    // Como no podemos responder, mutamos la request y poenmos la informacion en el body
    req.body = data
    next()
  })
})

app.get('/pokemon-ditto', (req, res) => { // Tener una funcion que recibe un request y un responde
  res.json(dittoJSON)
})

// Ya no lo necesitamos, esta en el middleware
app.post('/pokemon', (req, res) => {
  // Con el req.body deberiamos guardar en la base de datos
  res.status(201).json(req.body) // Al usar el middleware
//   let body = ''
//   // escuchar el evento data
//   req.on('data', (chunk) => {
//     body += chunk.toString() // Para cada informacion que recibe la concatenamos al body
//   })
//   req.on('end', () => { // Se ejecuta cuando termina de recibir la informacion
//     const data = JSON.parse(body)
//     // llamar a una base de datos para guardar la informacion
//     res.status(201).json(data)
//   })
})

// Al usar un use significa que acepta todos los metodos
app.use((req, res) => { // Debe estar de ultimo
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => { // Escuchar en el puerto 3000
  console.log(`Server listening on port http://localhost:${PORT}`)
})
