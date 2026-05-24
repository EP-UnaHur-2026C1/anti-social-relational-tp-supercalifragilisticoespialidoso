export const exampleSchema = {
  name: { type: 'string', required: true },
  description: { type: 'string', required: false },
}

export const validateExample = (body) => {
  const errors = []
  if (!body.name || typeof body.name !== 'string')
    errors.push('name es requerido y debe ser string')
  return errors
}
