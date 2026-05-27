import * as exampleRepository from '../repositories/example.repository.js'

export const getAll = () => exampleRepository.findAll()

export const getById = (id) => exampleRepository.findById(id)

export const create = (data) => exampleRepository.create(data)

export const update = (id, data) => exampleRepository.update(id, data)

export const remove = (id) => exampleRepository.remove(id)
