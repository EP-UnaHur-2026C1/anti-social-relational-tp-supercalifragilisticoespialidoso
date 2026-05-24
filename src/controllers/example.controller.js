import * as exampleService from '../services/example.service.js'

export const getAll = (req, res) => {
  res.json(exampleService.getAll())
}

export const getById = (req, res) => {
  const item = exampleService.getById(Number(req.params.id))
  if (!item) return res.status(404).json({ error: 'No encontrado' })
  res.json(item)
}

export const create = (req, res) => {
  res.status(201).json(exampleService.create(req.body))
}

export const update = (req, res) => {
  const item = exampleService.update(Number(req.params.id), req.body)
  if (!item) return res.status(404).json({ error: 'No encontrado' })
  res.json(item)
}

export const remove = (req, res) => {
  const ok = exampleService.remove(Number(req.params.id))
  if (!ok) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).send()
}
