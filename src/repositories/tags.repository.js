import { Tag, Post, User } from '../models/index.js'

export const findAll = () => Tag.findAll()

export const findById = (id) =>
  Tag.findByPk(id, {
    include: [
      {
        model: Post,
        as: 'posts',
        include: [{ model: User, as: 'user', attributes: ['id', 'nickName'] }],
      },
    ],
  })

export const findByIdSimple = (id) => Tag.findByPk(id)

export const create = (data) => Tag.create(data)

export const update = (tag, data) => {
  Object.assign(tag, data)
  return tag.save()
}

export const remove = (tag) => tag.destroy()
