import crypto from 'node:crypto'
import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // 1. Validaciones de usuario (opcional: zod)
    Validation.username(username)
    Validation.password(password)
    // 2. Verificar que el usuario no exista
    const user = User.findOne({ username })
    if (user) throw new Error('User already exists')

    // 3. Crea el usario
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)// hashSync bloquea el thread principal

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)// Validaciones
    Validation.password(password)

    const user = User.findOne({ username }) // Buscamos si el usuario existe
    if (!user) throw new Error('username doesnt exist')

    const isValid = bcrypt.compare(password, user.password) // Compara si la contraseña es la misma a la base
    if (!isValid) throw new Error('contraseña invalida')
    const { password: _, ...publicUser } = user // Determinamos que partes del usuario queremos mostrar
    return (publicUser)
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters long')
  }
}
