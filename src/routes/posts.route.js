import { Router } from 'express'
import * as postsController from '../controllers/posts.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.js'
import { postSchema, updatePostSchema } from '../schemas/post.schema.js'
import { postImageSchema } from '../schemas/postImages.schema.js'

const router = Router()

router.get('/posts', postsController.getAll)
router.get('/posts/:id', postsController.getById)
router.post('/posts', schemaValidator(postSchema), postsController.create)
router.put('/posts/:id', schemaValidator(updatePostSchema), postsController.update)
router.delete('/posts/:id', postsController.remove)

// POST_IMAGES

router.post('/posts/:id/images', schemaValidator(postImageSchema), postsController.addImage)
router.delete(
  '/posts/:id/images/:imageId',
  schemaValidator(postImageSchema),
  postsController.removeImage,
)

// PARA TAGS

router.post('/posts/:id/tags', postsController.addTag)
router.delete('/posts/:id/tags/:tagId', postsController.removeTag)

export { router }
