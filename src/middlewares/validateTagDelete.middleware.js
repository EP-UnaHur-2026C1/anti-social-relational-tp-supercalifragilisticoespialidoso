import * as postsService from '../services/posts.service.js'
import * as tagsService from '../services/tags.service.js'

export const validateTagDelete = async (req, res, next) => {
  const post = await postsService.getById(req.params.id)
  const tag = await tagsService.getById(req.params.tagId)

  if (!post.tags.includes(tag.id)) {
    return res.status(400).json({ message: 'Tag is not associated with the post' })
  }

  req.tag = tag
  req.post = post
  next()
}
