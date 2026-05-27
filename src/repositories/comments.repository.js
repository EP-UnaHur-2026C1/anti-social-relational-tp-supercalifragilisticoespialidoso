import { Comment, User, Post } from '../models/index.js'

export const findAll = () =>
  Comment.findAll({
    where: { isVisible: true },
    include: [
      { model: User, as: 'user', attributes: ['id', 'nickName'] },
      { model: Post, as: 'post', attributes: ['id', 'description'] },
    ],
  })

export const findById = (id) =>
  Comment.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'nickName'] },
      { model: Post, as: 'post', attributes: ['id', 'description'] },
    ],
  })

export const create = (data) => Comment.create(data)

export const update = (comment, data) => {
  Object.assign(comment, data)
  return comment.save()
}

export const remove = (comment) => comment.destroy()
