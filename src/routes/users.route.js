import { Router } from 'express'
import * as usersController from '../controllers/users.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.js'
import { userSchema } from '../schemas/user.schema.js'

const router = Router()

router.get('/users', usersController.getAll)
router.get('/users/:id', usersController.getById)
router.post('/users', schemaValidator(userSchema), usersController.create)
router.put('/users/:id', schemaValidator(userSchema), usersController.update)
router.delete('/users/:id', usersController.remove)

router.post('/users/:followerId/follow/:followedId', usersController.follow)
router.delete('/users/:followerId/unfollow/:followedId', usersController.unfollow)

export { router }
