import { Router } from 'express'
import * as tagsController from '../controllers/tags.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.middleware.js'
import { validateTagId } from '../middlewares/validateTagId.middleware.js'
import { tagSchema } from '../schemas/tag.schema.js'

const router = Router()

router.get('/tags', tagsController.getAll)
router.get('/tags/:id', validateTagId, tagsController.getById)
router.post('/tags', schemaValidator(tagSchema), tagsController.create)
router.put('/tags/:id', validateTagId, schemaValidator(tagSchema), tagsController.update)
router.delete('/tags/:id', validateTagId, tagsController.remove)

export { router }
