import Joi from 'joi'

export const userSchema = Joi.object({
  nickName: Joi.string().min(3).max(50).required().messages({
    'any.required': 'nickName es requerido',
    'string.min': 'nickName debe tener al menos {#limit} caracteres',
    'string.max': 'nickName puede tener hasta {#limit} caracteres',
    'string.empty': 'nickName no puede estar vacío',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'email es requerido',
    'string.email': 'email debe ser una dirección de correo válida',
    'string.empty': 'email no puede estar vacío',
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'name es requerido',
    'string.min': 'name debe tener al menos {#limit} caracteres',
    'string.empty': 'name no puede estar vacío',
  }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'El atributo {#label} no está permitido.',
  })
