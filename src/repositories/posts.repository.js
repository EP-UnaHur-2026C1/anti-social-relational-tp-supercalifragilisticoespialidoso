import { Op } from 'sequelize'
import { Post, User, PostImage, Comment, Tag } from '../models/index.js'

export const findAll = () =>
  Post.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'nickName'] },
      { model: Tag, as: 'tags' },
    ],
  })

export const findById = (id) => Post.findByPk(id)

export const findByIdWithRelations = (id, commentCutoff) =>
  Post.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'nickName'] },
      { model: PostImage, as: 'images' },
      { model: Tag, as: 'tags' },
      {
        model: Comment,
        as: 'comments',
        where: { createdAt: { [Op.gte]: commentCutoff } },
        required: false,
        include: [{ model: User, as: 'user', attributes: ['id', 'nickName'] }],
      },
    ],
  })

export const create = (data) => Post.create(data)

export const update = (post, data) => {
  Object.assign(post, data)
  return post.save()
}

export const remove = (post) => post.destroy()

export const addImage = (postId, url) => PostImage.create({ url, postId })

export const findImage = (imageId, postId) => PostImage.findOne({ where: { id: imageId, postId } })

export const removeImage = (image) => image.destroy()

export const addTag = (post, tag) => post.addTags(tag)

export const removeTag = (post, tag) => post.removeTags(tag)
