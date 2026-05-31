import { Router } from 'express'
import * as usersController from '../controllers/users.controller.js'

const router = Router()

router.get('/users', usersController.getAll)
router.get('/users/:id', usersController.getById)
router.post('/users', usersController.create)
router.put('/users/:id', usersController.update)
router.delete('/users/:id', usersController.remove)

router.post('/users/:followerId/follow/:followedId', usersController.follow)
router.delete('/users/:followerId/unfollow/:followedId', usersController.unfollow)

export { router }
