import * as postsRepo from '../repositories/posts.repository.js'
import * as tagsRepo from '../repositories/tags.repository.js'

const getCommentCutoff = () => {
  const months = Number(process.env.COMMENT_MONTHS ?? 6)
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  return cutoff
}

export const getAll = async (req, res, next) => {
  try {
    const items = await postsRepo.findAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const cutoff = getCommentCutoff()
    const item = await postsRepo.findByIdWithRelations(req.params.id, cutoff)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await postsRepo.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const post = await postsRepo.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'No encontrado' })
    const updated = await postsRepo.update(post, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const post = await postsRepo.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'No encontrado' })
    await postsRepo.remove(post)
    res.status(200).json(post)
  } catch (err) {
    next(err)
  }
}

// POST_IMAGES

export const addImage = async (req, res, next) => {
  try {
    const { url } = req.body
    const postId = req.params.id
    const post = await postsRepo.findById(postId)
    if (!post) return res.status(404).json({ error: 'Post no encontrado' })
    const image = await postsRepo.addImage(postId, url)
    res.status(201).json(image)
  } catch (err) {
    next(err)
  }
}

export const removeImage = async (req, res, next) => {
  try {
    const { imageId } = req.params
    const postId = req.params.id
    const image = await postsRepo.findImage(imageId, postId)
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada' })
    await postsRepo.removeImage(image)
    res.status(200).json(image)
  } catch (err) {
    next(err)
  }
}

// PARA TAGS

export const addTag = async (req, res, next) => {
  try {
    const post = await postsRepo.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post no encontrado' })
    const tag = await tagsRepo.findByIdSimple(req.body.tagId)
    if (!tag) return res.status(404).json({ error: 'Tag no encontrado' })
    await postsRepo.addTag(post, tag)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const removeTag = async (req, res, next) => {
  try {
    const post = await postsRepo.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post no encontrado' })
    const tag = await tagsRepo.findByIdSimple(req.params.tagId)
    if (!tag) return res.status(404).json({ error: 'Tag no encontrado' })
    await postsRepo.removeTag(post, tag)
    res.status(200).json(tag)
  } catch (err) {
    next(err)
  }
}
