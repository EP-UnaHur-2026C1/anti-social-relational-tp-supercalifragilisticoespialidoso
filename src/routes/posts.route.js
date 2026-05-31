import { Router } from 'express'
import * as postsController from '../controllers/posts.controller.js'

const router = Router()

router.get('/posts', postsController.getAll)
router.get('/posts/:id', postsController.getById)
router.post('/posts', postsController.create)
router.put('/posts/:id', postsController.update)
router.delete('/posts/:id', postsController.remove)

// POST_IMAGES

router.post('/posts/:id/images', postsController.addImage)
router.delete('/posts/:id/images/:imageId', postsController.removeImage)

// PARA TAGS

router.post('/posts/:id/tags', postsController.addTag)
router.delete('/posts/:id/tags/:tagId', postsController.removeTag)

export { router }
