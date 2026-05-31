import * as usersRepo from '../repositories/users.repository.js'

export const getAll = () => usersRepo.findAll()

export const getById = (id) => usersRepo.findByIdWithRelations(id)

export const create = (data) => usersRepo.create(data)

export const update = (id, data) => usersRepo.update(id, data)

export const remove = (id) => usersRepo.remove(id)

export const follow = (followerId, followedId) => usersRepo.addFollowing(followerId, followedId)

export const unfollow = (followerId, followedId) =>
  usersRepo.removeFollowing(followerId, followedId)
