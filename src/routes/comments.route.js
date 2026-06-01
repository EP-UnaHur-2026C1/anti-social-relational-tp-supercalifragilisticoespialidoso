import { Router } from 'express'
import * as commentsController from '../controllers/comments.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.js'
import { commentSchema, updateCommentSchema } from '../schemas/comment.schema.js'

const router = Router()

router.get('/comments', commentsController.getAll)
router.get('/comments/:id', commentsController.getById)
router.post('/comments', schemaValidator(commentSchema), commentsController.create)
router.put('/comments/:id', schemaValidator(updateCommentSchema), commentsController.update)
router.delete('/comments/:id', commentsController.remove)

export { router }
