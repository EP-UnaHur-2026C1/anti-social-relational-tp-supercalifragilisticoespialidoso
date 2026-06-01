import * as commentsService from '../services/comments.service.js'
export const getAll = async (req, res, next) => {
  try {
    const items = await commentsService.getAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const item = await commentsService.getById(req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await commentsService.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const comment = await commentsService.getById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'No encontrado' })
    const updated = await commentsService.update(comment, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const comment = await commentsService.getById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'No encontrado' })
    await commentsService.remove(comment)
    res.status(200).json(comment)
  } catch (err) {
    next(err)
  }
}
