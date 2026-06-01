import { Router } from 'express'
import * as postsController from '../controllers/posts.controller.js'
import { schemaValidator } from '../middlewares/schemaValidator.middleware.js'
import { validatePostId } from '../middlewares/validatePostId.middleware.js'
import { postSchema, updatePostSchema } from '../schemas/post.schema.js'
import { postImageSchema } from '../schemas/postImages.schema.js'

const router = Router()

router.get('/posts', postsController.getAll)
router.get('/posts/:id', validatePostId, postsController.getById)
router.post('/posts', schemaValidator(postSchema), postsController.create)
router.put('/posts/:id', validatePostId, schemaValidator(updatePostSchema), postsController.update)
router.delete('/posts/:id', validatePostId, postsController.remove)

// POST_IMAGES

router.post(
  '/posts/:id/images',
  validatePostId,
  schemaValidator(postImageSchema),
  postsController.addImage,
)
router.delete(
  '/posts/:id/images/:imageId',
  validatePostId,
  schemaValidator(postImageSchema),
  postsController.removeImage,
)

// PARA TAGS

router.post('/posts/:id/tags', validatePostId, postsController.addTag)
router.delete('/posts/:id/tags/:tagId', validatePostId, postsController.removeTag)

export { router }
