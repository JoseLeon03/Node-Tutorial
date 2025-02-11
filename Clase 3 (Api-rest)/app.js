const express = require('express')
const app = express()
const crypto = require('node:crypto') // Para crear un id unico
const PORT = process.env.PORT ?? 3000
const movies = require('./movies.json')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

app.disable('x-powered-by')

// Metodos normales: GET, HEAD, POST
// Metodos complejos: PUT, DELETE, PATCH

// CORS PRE-FLIGHT
// OPTIONS

app.use(cors({ // Middleware para permitir el acceso a la api desde cualquier origen
  origin: (origin, callback) => { // origin es el origen de la peticion
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://myapp.com'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) { // Si el origen esta en la lista de origenes aceptados o si no hay origen
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))

app.use(express.json()) // Middleware para parsear el body de las peticiones a json

app.get('/', (req, res) => {
  // // leer el query param de format
  // const format = req.query.format
  // if (format === 'html') { // si el query param es html
  //   res.send('<h1>hola mundo</h1>')
  // }
  res.json({ message: 'hola mundo' })
})

// Todos los recursos que sean movies se identifica con /movies
app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*') // Permitimos que cualquier origen pueda acceder a la api //Queda deprecated con el app.use cors
  // const Origin = req.headers.origin
  // if (ACCEPTED_ORIGINS.includes(Origin) || !Origin) { // Si el origen esta en la lista de origenes aceptados o si no hay origen
  //   res.header('Access-Control-Allow-Origin', Origin)
  // }

  const { genre } = req.query
  if (genre) { // si el query param genre existe (Este lo podemos encontrar en la url)
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

//  Conseguimos el id de la pelicula y luego podemos acceder a la pelicula
app.get('/movies/:id', (req, res) => { // path-to-regexp
  const { id } = req.params // aqui obtenemos el id de la pelicula
  const movie = movies.find(movie => movie.id === id) //  find retorna el primer elemento que cumple la condicion, es decir, el elemento que tiene el id que estamos buscando
  if (movie) {
    return res.json(movie)
  } else {
    return res.status(404).json({ message: 'Movie not found' })
  }
})

// Crear una pelicula
app.post('/movies', (req, res) => { // Movies porque es el recurso que estamos creando
  const result = validateMovie(req.body) // Validamos los datos que nos envia el usuario
  if (result.error) { // Si no es exitoso
    return res.status(400).json({ // Respondemos con un status 400
      errors: result.error.errors // Y los errores que ocurrieron
    })
  }
  // const { // Quedo deprecated con la validacion arriba
  //   title,
  //   genre,
  //   year,
  //   director,
  //   duration,
  //   rate
  // } = req.body // obtenemos los datos del body enviados por el usuario (Usamos el middleware express.json())

  // Esto deberia ir a la base de datos
  const newMovie = { // Para crear la id usamos node: crypto porque es una libreria que viene con node
    id: crypto.randomUUID(), // Creamos un id unico
    // title,
    // genre,
    // year,
    // director,
    // duration,
    // rate
    ...result.data // Si hemos validado los datos, podemos usar result.data para obtener los datos validados
  }

  // Esto no seria REST, porque estamos guardando
  // el estado de la aplicacion en memoria
  movies.push(newMovie) // Agregamos la pelicula a la lista de peliculas
  res.status(201).json(newMovie) // Respondemos con la pelicula creada
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body) // Validamos los datos que nos envia el usuario

  if (!result.success) {
    return res.status(400).json({ errors: JSON.parse(result.error.errors) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id) // Buscamos la pelicula por el id

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = { // Actualizamos la pelicula
    ...movies[movieIndex],
    ...result.data
  }

  console.log(movies[movieIndex])
  movies[movieIndex] = updateMovie // Actualizamos la pelicula en la lista de peliculas
  return res.json(updateMovie) // Respondemos con la pelicula actualizada
})

app.delete('/movies/:id', (req, res) => {
  // const Origin = req.headers.origin
  // if (ACCEPTED_ORIGINS.includes(Origin) || !Origin) { // Si el origen esta en la lista de origenes aceptados o si no hay origen
  //   res.header('Access-Control-Allow-Origin', Origin)
  // }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id) // Buscamos la pelicula por el id

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1) // Eliminamos la pelicula de la lista de peliculas
  return res.status(204).json({ message: 'Movie deleted' }) // Respondemos con un status 204
})

// app.options('/movies/:id', (req, res) => {
//   // const Origin = req.headers.origin
//   // if (ACCEPTED_ORIGINS.includes(Origin) || !Origin) { // Si el origen esta en la lista de origenes aceptados o si no hay origen
//   //   res.header('Access-Control-Allow-Origin', Origin)
//   //   res.header('Access-Control-Allow-Methods', 'DELETE, PATCH, OPTIONS')
//   // }
//   res.send(200)
// })

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
