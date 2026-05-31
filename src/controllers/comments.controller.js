import * as commentsRepo from '../repositories/comments.repository.js'

export const getAll = async (req, res, next) => {
  try {
    const items = await commentsRepo.findAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const item = await commentsRepo.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await commentsRepo.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const comment = await commentsRepo.findById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'No encontrado' })
    const updated = await commentsRepo.update(comment, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const comment = await commentsRepo.findById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'No encontrado' })
    await commentsRepo.remove(comment)
    res.status(200).json(comment)
  } catch (err) {
    next(err)
  }
}
