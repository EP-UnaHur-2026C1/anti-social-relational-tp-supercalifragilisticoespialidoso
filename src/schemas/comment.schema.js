import Joi from 'joi'

export const commentSchema = Joi.object({
  text: Joi.string().min(1).required().messages({
    'any.required': 'text es requerido',
    'string.empty': 'text no puede estar vacío',
  }),
  postId: Joi.number().integer().positive().required().messages({
    'any.required': 'postId es requerido',
    'number.base': 'postId debe ser un número entero positivo',
  }),
  userId: Joi.number().integer().positive().required().messages({
    'any.required': 'userId es requerido',
    'number.base': 'userId debe ser un número entero positivo',
  }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'El atributo {#label} no está permitido.',
  })

export const updateCommentSchema = Joi.object({
  text: Joi.string().min(1).required().messages({
    'any.required': 'text es requerido',
    'string.empty': 'text no puede estar vacío',
  }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'El atributo {#label} no está permitido.',
  })
