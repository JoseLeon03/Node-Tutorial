import z from 'zod'

const movieSchema = z.object({ // Creamos un esquema para validar los datos que nos envia el usuario
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  genre: z.array(
    z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'])
  ),
  rate: z.number().min(1).max(10).default(5)
})

export function validateMovie (object) {
  return movieSchema.safeParse(object) // Usamos el metodo safeParse para validar los datos que nos envia el usuario
}

export function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object) // Usamos el metodo partial para validar solo los campos que nos envia el usuario
  // Si la propiedad esta validala, si no, ignorala
}
