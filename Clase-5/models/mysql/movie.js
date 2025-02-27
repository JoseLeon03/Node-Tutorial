import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123456',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getALL ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // Consigue las peliculas que tengan el genero que se paso por query param
      // const [genres] = await connection.query(
      //   `SELECT movie.title, genre.name FROM movies_genre
      //   inner join genre on genre.id = movies_genre.genre_id
      //   inner join movie on movie.id = movies_genre.movie_id
      //   WHERE LOWER(name) = ?`, [lowerCaseGenre])
      const [genres] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(name) = ?',
        [lowerCaseGenre])

      // Si no se encuentran generos
      if (genres.length === 0) return { message: 'Genre not found' }

      const [{ id }] = genres

      const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate ,BIN_TO_UUID(id) id FROM movie
        inner join movies_genre on movie.id = movies_genre.movie_id
        WHERE movies_genre.genre_id = (?)`, [id])

      if (movies.length === 0) return { message: 'Movies not found' }
      return movies
    }
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate ,BIN_TO_UUID(id) id FROM movie')
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate ,BIN_TO_UUID(id) id FROM movie
      WHERE id = UUID_TO_BIN(?)`, [id])
    if (movies.length === 0) return null
    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // Genre es un array de strings
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('Select UUID() uuid;')
    const [{ uuid }] = uuidResult

    // Insert the new movie
    try {
      await connection.query(
      `INSERT INTO movie (id, title, year, duration, director, rate, poster)
      VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
      [uuid, title, year, duration, director, rate, poster]
      )
    } catch (e) {
      // No debe verlo el usuario
      throw new Error('Error creating movie')
    }

    // const [movies] = await connection.query(
    //   `Select title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
    //   from movie where id = UUID_TO_BIN(?)`,
    //   [uuid]
    // )

    // console.log(movies)
    // Insert genres for the new movie
    for (const genre of genreInput) {
      const [genreResult] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(name) = ?',
        [genre.toLowerCase()]
      )

      let genreId
      if (genreResult.length === 0) {
        const [insertGenreResult] = await connection.query(
          'INSERT INTO genre (name) VALUES (?)',
          [genre]
        )
        genreId = insertGenreResult.insertId
      } else {
        genreId = genreResult[0].id
      }
      await connection.query(
        'INSERT INTO movies_genre (movie_id, genre_id) VALUES (?, ?)',
        [uuid, genreId]
      )
    }

    return { id: uuid, ...input }
  }

  static async delete ({ id }) {
    const [result] = await connection.query(
      'Delete from movie where id = UUID_TO_BIN(?)',
      [id]
    )
    return (result)
  }

  static async update ({ id, input }) {
    const {
      // genre: genreInput, // Genre es un array de strings
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [movie] = await connection.query(`
        Select * from movie where id = UUID_TO_BIN(?)`,
    [id])

    if (movie.length === 0) return null

    // Update the movie
    await connection.query(
      `UPDATE movie SET title = ?, year = ?, duration = ?, director = ?, rate = ?, poster = ?
      WHERE id = UUID_TO_BIN(?)`,
      [title, year, duration, director, rate, poster, id]
    )

    // // Delete existing genres for the movie
    // await connection.query(
    //   'DELETE FROM movies_genre WHERE movie_id = UUID_TO_BIN(?)',
    //   [id]
    // )

    // // Insert new genres for the movie
    // for (const genre of genreInput) {
    //   const [genreResult] = await connection.query(
    //     'SELECT id FROM genre WHERE LOWER(name) = ?',
    //     [genre.toLowerCase()]
    //   )

    //   let genreId
    //   if (genreResult.length === 0) {
    //     const [insertGenreResult] = await connection.query(
    //       'INSERT INTO genre (name) VALUES (?)',
    //       [genre]
    //     )
    //     genreId = insertGenreResult.insertId
    //   } else {
    //     genreId = genreResult[0].id
    //   }

    //   await connection.query(
    //     'INSERT INTO movies_genre (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
    //     [id, genreId]
    //   )
    // }

    return { id, ...input }
  }
}
