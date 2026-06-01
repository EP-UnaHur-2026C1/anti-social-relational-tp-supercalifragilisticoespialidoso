import Joi from 'joi'

export const tagSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'any.required': 'name es requerido',
    'string.empty': 'name no puede estar vacío',
    'string.max': 'name puede tener hasta {#limit} caracteres',
  }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'El atributo {#label} no está permitido.',
  })
