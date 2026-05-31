import * as commentsRepository from '../repositories/comments.repository.js'

export const getAll = () => commentsRepository.findAll()

export const getById = (id) => commentsRepository.findById(id)

export const create = (data) => commentsRepository.create(data)

export const update = (id, data) => commentsRepository.update(id, data)

export const remove = (id) => commentsRepository.remove(id)
