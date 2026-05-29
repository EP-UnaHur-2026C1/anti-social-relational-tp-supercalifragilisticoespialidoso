import { Router } from 'express'
import * as tagsController from '../controllers/tags.controller.js'

const router = Router()

router.get('/tags', tagsController.getAll)
router.get('/tags/:id', tagsController.getById)
router.post('/tags', tagsController.create)
router.put('/tags/:id', tagsController.update)
router.delete('/tags/:id', tagsController.remove)

export { router }
