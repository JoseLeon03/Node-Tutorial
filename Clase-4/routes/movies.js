import { Router } from 'express' // Permite crear rutas  y responder a peticiones
import { MovieController } from '../controllers/movies.js'
export const moviesRouter = Router() // Creamos una instancia de Router

moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.post('/', MovieController.create)
moviesRouter.delete('/:id', MovieController.delete)
moviesRouter.patch('/:id', MovieController.update)
