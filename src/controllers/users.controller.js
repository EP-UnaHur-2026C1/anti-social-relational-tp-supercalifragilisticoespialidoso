import * as usersRepo from '../repositories/users.repository.js'

export const getAll = async (req, res, next) => {
  try {
    const items = await usersRepo.findAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const item = await usersRepo.findByIdWithRelations(req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await usersRepo.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const user = await usersRepo.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'No encontrado' })
    const updated = await usersRepo.update(user, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const user = await usersRepo.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'No encontrado' })
    await usersRepo.remove(user)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export const follow = async (req, res, next) => {
  try {
    const follower = await usersRepo.findById(req.params.followerId)
    const followed = await usersRepo.findById(req.params.followedId)
    if (!follower || !followed) return res.status(404).json({ error: 'Usuario no encontrado' })
    await usersRepo.addFollowing(follower, followed)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const unfollow = async (req, res, next) => {
  try {
    const follower = await usersRepo.findById(req.params.followerId)
    const followed = await usersRepo.findById(req.params.followedId)
    if (!follower || !followed) return res.status(404).json({ error: 'Usuario no encontrado' })
    await usersRepo.removeFollowing(follower, followed)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
