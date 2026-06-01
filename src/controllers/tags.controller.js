import * as tagsService from '../services/tags.service.js'

export const getAll = async (req, res, next) => {
  try {
    const items = await tagsService.getAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const item = await tagsService.getById(req.params.id)
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await tagsService.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const updated = await tagsService.update(req.tag, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await tagsService.remove(req.tag)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
