import * as commentsService from '../services/comments.service.js'

export const validateCommentId = async (req, res, next) => {
  const comment = await commentsService.getById(req.params.id)
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' })
  }
  req.comment = comment
  next()
}
