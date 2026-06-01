import * as usersService from '../services/users.service.js'

export const validateFollow = async (req, res, next) => {
  const { followerId, followedId } = req.params

  if (followerId === followedId) {
    return res.status(400).json({ error: 'No puedes seguirte a ti mismo' })
  }

  const follower = await usersService.getById(followerId)
  if (!follower) {
    return res.status(404).json({ error: `Usuario con id ${followerId} no encontrado` })
  }

  const followed = await usersService.getById(followedId)
  if (!followed) {
    return res.status(404).json({ error: `Usuario con id ${followedId} no encontrado` })
  }

  req.follower = follower
  req.followed = followed
  next()
}
