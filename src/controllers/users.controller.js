import * as usersService from '../services/users.service.js'
export const getAll = async (req, res, next) => {
  try {
    const items = await usersService.getAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const item = await usersService.getById(req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await usersService.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id)
    if (!user) return res.status(404).json({ error: 'No encontrado' })
    const updated = await usersService.update(user, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id)
    if (!user) return res.status(404).json({ error: 'No encontrado' })
    await usersService.remove(user)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export const follow = async (req, res, next) => {
  try {
    const follower = await usersService.getById(req.params.followerId)
    const followed = await usersService.getById(req.params.followedId)
    if (!follower || !followed) return res.status(404).json({ error: 'Usuario no encontrado' })
    await usersService.follow(follower, followed)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const unfollow = async (req, res, next) => {
  try {
    const follower = await usersService.getById(req.params.followerId)
    const followed = await usersService.getById(req.params.followedId)
    if (!follower || !followed) return res.status(404).json({ error: 'Usuario no encontrado' })
    await usersService.unfollow(follower, followed)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
