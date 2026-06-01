import * as commentsService from '../services/comments.service.js'

export const getAll = async (req, res, next) => {
  try {
    const items = await commentsService.getAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = (req, res) => res.json(req.comment)

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
    const updated = await commentsService.update(req.comment, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await commentsService.remove(req.comment)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
