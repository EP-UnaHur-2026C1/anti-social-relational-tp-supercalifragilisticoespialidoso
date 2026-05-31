import * as tagsRepo from '../repositories/tags.repository.js'

export const getAll = () => tagsRepo.findAll()

export const getById = (id) => tagsRepo.findById(id)

export const getByIdSimple = (id) => tagsRepo.findByIdSimple(id)

export const create = (data) => tagsRepo.create(data)

export const update = (tag, data) => tagsRepo.update(tag, data)

export const remove = (tag) => tagsRepo.remove(tag)
