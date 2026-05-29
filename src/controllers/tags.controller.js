import * as tagsRepo from '../repositories/tags.repository.js'

export const getAll = async (req, res, next) => {
  try {
    const items = await tagsRepo.findAll()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export const getById = async (req, res, next) => {
  try {
    const item = await tagsRepo.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await tagsRepo.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const tag = await tagsRepo.findByIdSimple(req.params.id)
    if (!tag) return res.status(404).json({ error: 'No encontrado' })
    const updated = await tagsRepo.update(tag, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const tag = await tagsRepo.findByIdSimple(req.params.id)
    if (!tag) return res.status(404).json({ error: 'No encontrado' })
    await tagsRepo.remove(tag)
    res.status(200).json(tag)
  } catch (err) {
    next(err)
  }
}
