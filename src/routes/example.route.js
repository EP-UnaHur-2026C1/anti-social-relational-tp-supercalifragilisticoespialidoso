import { Router } from 'express'
import * as exampleController from '../controllers/example.controller.js'
import { validateMiddleware } from '../middlewares/validate.middleware.js'
import { validateExample } from '../schemas/example.schema.js'

const router = Router()

router.get('/examples', exampleController.getAll)
router.get('/examples/:id', exampleController.getById)
router.post('/examples', validateMiddleware(validateExample), exampleController.create)
router.put('/examples/:id', exampleController.update)
router.delete('/examples/:id', exampleController.remove)

export { router }
