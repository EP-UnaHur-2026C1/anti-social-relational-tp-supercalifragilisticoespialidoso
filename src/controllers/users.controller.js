import * as usersService from '../services/users.service.js'

export const getAll = async (req, res, next) => {
  try {
    const items = await usersService.getAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = (req, res) => res.json(req.user)

export const getFollowers = (req, res) => res.json(req.user.followers)

export const getFollowing = (req, res) => res.json(req.user.following)

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
    const updated = await usersService.update(req.user, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.user)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const follow = async (req, res, next) => {
  try {
    await usersService.follow(req.follower, req.followed)
    res.status(201).json({ message: `${req.follower.nickName} sigue a ${req.followed.nickName}` })
  } catch (err) {
    next(err)
  }
}

export const unfollow = async (req, res, next) => {
  try {
    await usersService.unfollow(req.follower, req.followed)
    res
      .status(200)
      .json({ message: `${req.follower.nickName} dejó de seguir a ${req.followed.nickName}` })
  } catch (err) {
    next(err)
  }
}
