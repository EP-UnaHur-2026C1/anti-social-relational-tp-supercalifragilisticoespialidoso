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
    if (!item) return res.status(404).json({ error: 'No encontrado' })
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
    const tag = await tagsService.getByIdSimple(req.params.id)
    if (!tag) return res.status(404).json({ error: 'No encontrado' })
    const updated = await tagsService.update(tag, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const tag = await tagsService.getByIdSimple(req.params.id)
    if (!tag) return res.status(404).json({ error: 'No encontrado' })
    await tagsService.remove(tag)
    res.status(200).json(tag)
  } catch (err) {
    next(err)
  }
}
