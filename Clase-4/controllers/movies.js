import { MovieModel } from '../models/local-file-system/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

// Aca el controlador
export class MovieController {
  static async getAll (req, res) { // Este metodo es para obtener todas las peliculas
    // Al usar async colocamos todo en un try catch pero es mejor llevarlo en middleware
    const { genre } = req.query
    const movies = await MovieModel.getALL({ genre }) // Obtenemos todas las peliculas
    // El model de arriba deja lo de abajo obsoleto
    //   if (genre) { // si el query param genre existe (Este lo podemos encontrar en la url)
    //     const filteredMovies = movies.filter(
    //       movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    //     )
    //     return res.json(filteredMovies)
    //   }
    // que es lo que renderiza
    res.json(movies)
  }

  static async getById (req, res) { // Este metodo es para obtener una pelicula por su id
    const { id } = req.params // aqui obtenemos el id de la pelicula
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    return res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) { // Movies porque es el recurso que estamos creando
    const result = validateMovie(req.body) // Validamos los datos que nos envia el usuario
    if (result.error) { // Si no es exitoso
      return res.status(400).json({ // Respondemos con un status 400
        errors: result.error.errors // Y los errores que ocurrieron
      })
    }
    const newMovie = await MovieModel.create({ input: result.data }) //
    res.status(201).json(newMovie) // Respondemos con la pelicula creada
  }

  static async delete (req, res) { // Este metodo es para eliminar una pelicula
    const { id } = req.params
    const result = await MovieModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.status(204).json({ message: 'Movie deleted' }) // Respondemos con un status 204
  }

  static async update (req, res) { // Este metodo es para actualizar una pelicula
    const result = validatePartialMovie(req.body) // Validamos los datos que nos envia el usuario

    if (!result.success) {
      return res.status(400).json({ errors: JSON.parse(result.error.errors) })
    }
    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, input: result.data })

    return res.json(updatedMovie) // Respondemos con la pelicula actualizada
  }
}
