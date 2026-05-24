import { User, Post } from '../models/index.js'

export const findAll = () => User.findAll()

export const findById = (id) => User.findByPk(id)

export const findByIdWithRelations = (id) =>
  User.findByPk(id, {
    include: [
      { model: Post, as: 'posts' },
      { model: User, as: 'followers', attributes: ['id', 'nickName', 'name'] },
      { model: User, as: 'following', attributes: ['id', 'nickName', 'name'] },
    ],
  })

export const findByIdWithFollowers = (id) =>
  User.findByPk(id, {
    include: [{ model: User, as: 'followers', attributes: ['id', 'nickName', 'name'] }],
  })

export const findByIdWithFollowing = (id) =>
  User.findByPk(id, {
    include: [{ model: User, as: 'following', attributes: ['id', 'nickName', 'name'] }],
  })

export const create = (data) => User.create(data)

export const update = (user, data) => {
  Object.assign(user, data)
  return user.save()
}

export const remove = (user) => user.destroy()

export const addFollowing = (follower, followed) => follower.addFollowing(followed)

export const removeFollowing = (follower, followed) => follower.removeFollowing(followed)
