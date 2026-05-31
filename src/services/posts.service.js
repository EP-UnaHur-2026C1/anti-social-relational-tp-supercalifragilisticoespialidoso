import * as postsRepo from '../repositories/posts.repository.js'

export const getAll = () => postsRepo.findAll()

export const getById = (id, commentCutoff) =>
  commentCutoff ? postsRepo.findByIdWithRelations(id, commentCutoff) : postsRepo.findById(id)

export const create = (data) => postsRepo.create(data)

export const update = (id, data) => postsRepo.update(id, data)

export const remove = (id) => postsRepo.remove(id)

export const findImage = (id, postId) => postsRepo.findImage(id, postId)
export const addImage = (postId, url) => postsRepo.addImage(postId, url)
export const removeImage = (image) => postsRepo.removeImage(image)

export const addTag = (post, tag) => postsRepo.addTag(post, tag)
export const removeTag = (post, tag) => postsRepo.removeTag(post, tag)
