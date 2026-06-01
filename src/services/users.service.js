import * as usersRepo from '../repositories/users.repository.js'

export const getAll = () => usersRepo.findAll()

export const getById = (id) => usersRepo.findByIdWithRelations(id)

export const create = (data) => usersRepo.create(data)

export const update = (user, data) => usersRepo.update(user, data)

export const remove = (user) => usersRepo.remove(user)

export const follow = (follower, followed) => usersRepo.addFollowing(follower, followed)

export const unfollow = (follower, followed) => usersRepo.removeFollowing(follower, followed)
