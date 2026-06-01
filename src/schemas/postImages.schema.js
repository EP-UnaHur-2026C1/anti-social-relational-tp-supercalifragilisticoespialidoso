import Joi from 'joi'

export const postImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'any.required': 'url es requerida',
    'string.uri': 'url debe ser una URL válida',
    'string.empty': 'url no puede estar vacía',
  }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'El atributo {#label} no está permitido.',
  })
