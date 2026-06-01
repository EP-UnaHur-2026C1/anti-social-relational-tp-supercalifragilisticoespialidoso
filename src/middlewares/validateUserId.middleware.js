import * as userService from '../services/users.service.js'

export const validateUserId = async (req, res, next) => {
  const user = await userService.getById(req.params.id)
  if (!user) {
    return res.status(404).json({ error: `Usuario con id ${req.params.id} no encontrado` })
  }
  req.user = user
  next()
}
