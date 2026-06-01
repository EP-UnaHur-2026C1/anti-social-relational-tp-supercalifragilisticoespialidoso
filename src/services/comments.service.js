import * as commentsRepository from '../repositories/comments.repository.js'

export const getAll = () => commentsRepository.findAll()

export const getById = (id) => commentsRepository.findById(id)

export const create = (data) => commentsRepository.create(data)

export const update = (comment, data) => commentsRepository.update(comment, data)

export const remove = (comment) => commentsRepository.remove(comment)
