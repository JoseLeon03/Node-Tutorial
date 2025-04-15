import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
const app = express()
// Importante
app.set('view engine', 'ejs')// Determinamos que sistema de plantilla usaremos

app.use(express.json()) // Middleware para parsear el body de las peticiones a json
app.use(cookieParser()) // Middleware para parsear las cookies

app.use((req, res, next) => {
  const token = req.cookies.access_token // Obtenemos el token de la cookie
  req.session = { user: null } // Inicializamos la sesion del usuario
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY) // Verificamos el token
    req.session.user = data
  } catch (e) {}

  next() // Continuamos con la siguiente funcion
})

app.get('/', (req, res) => {
  const { user } = req.session // Obtenemos el usuario de la sesion
  res.render('index', user) // Renderizamos la vista index.ejs y le pasamos el usuario
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username },
      SECRET_JWT_KEY, {
        expiresIn: '1h' // El token expira en 1 hora
      })
    res
      .cookie('access_token', token, {
        httpOnly: true, // Solo el servidor puede acceder a la cookie
        secure: process.env.NODE_ENV === 'production', // Solo se enviará por HTTPS
        sameSite: 'strict', // La cookie solo se enviará en el mismo sitio
        maxAge: 60 * 60 * 1000 // La cookie expirará en 1 hora
      })
      .status(201).json({ user })
  } catch (e) {
    // Normalmente no es buena idea mandar el error del repositorio al cliente
    res.status(401).json({ error: e.message })
  }
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await UserRepository.create({ username, password })
    res.status(201).json({ id })
  } catch (e) {
    // Normalmente no es buena idea mandar el error del repositorio al cliente
    res.status(400).json({ error: e.message })
  }
})
app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token') // Limpiamos la cookie del token
    .json({ message: 'Logged out' }) // Devolvemos un mensaje de logout
})

app.get('/protected', (req, res) => {
  const user = req.session.user
  if (!user) return res.status(403).json({ error: 'Unauthorized' }) // Si no existe el usuario, devolvemos un error 401
  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})
