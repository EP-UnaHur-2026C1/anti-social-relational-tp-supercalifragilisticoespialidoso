import { Router } from 'express'
import * as usersController from '../controllers/users.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.middleware.js'
import { userSchema } from '../schemas/user.schema.js'
import { validateUserId } from '../middlewares/validateUserId.middleware.js'
import { validateFollow } from '../middlewares/validateFollow.middleware.js'

const router = Router()

router.get('/users', usersController.getAll)
router.get('/users/:id', validateUserId, usersController.getById)
router.post('/users', schemaValidator(userSchema), usersController.create)
router.put('/users/:id', validateUserId, schemaValidator(userSchema), usersController.update)
router.delete('/users/:id', validateUserId, usersController.remove)

router.post('/users/:followerId/follow/:followedId', validateFollow, usersController.follow)
router.delete('/users/:followerId/unfollow/:followedId', validateFollow, usersController.unfollow)

export { router }
