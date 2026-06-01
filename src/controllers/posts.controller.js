import * as postsService from '../services/posts.service.js'
import * as tagsService from '../services/tags.service.js'

const getCommentCutoff = () => {
  const months = Number(process.env.COMMENT_MONTHS ?? 6)
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  return cutoff
}

export const getAll = async (req, res, next) => {
  try {
    const items = await postsService.getAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const cutoff = getCommentCutoff()
    const item = await postsService.getById(req.params.id, cutoff)
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await postsService.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const updated = await postsService.update(req.post, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await postsService.remove(req.post)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

// POST_IMAGES

export const addImage = async (req, res, next) => {
  try {
    const image = await postsService.addImage(req.params.id, req.body.url)
    res.status(201).json(image)
  } catch (err) {
    next(err)
  }
}

export const removeImage = async (req, res, next) => {
  try {
    const image = await postsService.findImage(req.params.imageId, req.params.id)
    if (!image) return res.status(404).json({ error: 'Image not found' })
    await postsService.removeImage(image)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

// PARA TAGS

export const addTag = async (req, res, next) => {
  try {
    const tag = await tagsService.getByIdSimple(req.params.tagId)
    if (!tag) return res.status(404).json({ error: 'Tag not found' })
    await postsService.addTag(req.post, tag)
    res.status(201).send()
  } catch (err) {
    next(err)
  }
}

export const removeTag = async (req, res, next) => {
  try {
    const tag = await tagsService.getByIdSimple(req.params.tagId)
    if (!tag) return res.status(404).json({ error: 'Tag not found' })
    await postsService.removeTag(req.post, tag)
    res.status(200).json(tag)
  } catch (err) {
    next(err)
  }
}
