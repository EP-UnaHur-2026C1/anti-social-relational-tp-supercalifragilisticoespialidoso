import { Router } from 'express'
import * as commentsController from '../controllers/comments.controller.js'

const router = Router()

router.get('/comments', commentsController.getAll)
router.get('/comments/:id', commentsController.getById)
router.post('/comments', commentsController.create)
router.put('/comments/:id', commentsController.update)
router.delete('/comments/:id', commentsController.remove)

export { router }
