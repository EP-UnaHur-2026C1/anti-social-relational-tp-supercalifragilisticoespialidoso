import { Router } from 'express'
import * as tagsController from '../controllers/tags.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.js'
import { tagSchema } from '../schemas/tag.schema.js'

const router = Router()

router.get('/tags', tagsController.getAll)
router.get('/tags/:id', tagsController.getById)
router.post('/tags', schemaValidator(tagSchema), tagsController.create)
router.put('/tags/:id', schemaValidator(tagSchema), tagsController.update)
router.delete('/tags/:id', tagsController.remove)

export { router }
