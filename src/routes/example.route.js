import { Router } from 'express'
import * as exampleController from '../controllers/example.controller.js'
import { validate } from '../middlewares/validate.js'
import { validateExample } from '../schemas/example.schema.js'

const router = Router()

router.get('/examples', exampleController.getAll)
router.get('/examples/:id', exampleController.getById)
router.post('/examples', validate(validateExample), exampleController.create)
router.put('/examples/:id', exampleController.update)
router.delete('/examples/:id', exampleController.remove)

export { router }
