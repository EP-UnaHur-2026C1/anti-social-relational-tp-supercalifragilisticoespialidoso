import { Router } from 'express'
import * as commentsController from '../controllers/comments.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.middleware.js'
import { commentSchema, updateCommentSchema } from '../schemas/comment.schema.js'
import { validateCommentId } from '../middlewares/validateCommentId.middleware.js'
const router = Router()

router.get('/comments', commentsController.getAll)
router.get('/comments/:id', validateCommentId, commentsController.getById)
router.post('/comments', schemaValidator(commentSchema), commentsController.create)
router.put(
  '/comments/:id',
  validateCommentId,
  schemaValidator(updateCommentSchema),
  commentsController.update,
)
router.delete('/comments/:id', validateCommentId, commentsController.remove)

export { router }
