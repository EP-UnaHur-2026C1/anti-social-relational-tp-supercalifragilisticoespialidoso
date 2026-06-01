import * as tagsService from '../services/tags.service.js'

export const validateTagId = async (req, res, next) => {
  const tag = await tagsService.getById(req.params.id)
  if (!tag) {
    return res.status(404).json({ message: 'Tag not found' })
  }
  req.tag = tag
  next()
}
