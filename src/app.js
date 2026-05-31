import express from 'express'
import { router as exampleRoute } from './routes/example.route.js'
import { router as usersRoute } from './routes/users.route.js'
import { router as postsRoute } from './routes/posts.route.js'
import { router as commentsRoute } from './routes/comments.route.js'
import { router as tagsRoute } from './routes/tags.route.js'

const app = express()

app.use(express.json())

app.use('/api', exampleRoute)
app.use('/api', usersRoute)
app.use('/api', postsRoute)
app.use('/api', commentsRoute)
app.use('/api', tagsRoute)

app.use((err, req, res) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ error: 'El valor ya existe', campo: Object.keys(err.fields).join(', ') })
  }
  res.status(err.status ?? 500).json({ error: err.message })
})

// app.use((err, req, res, next) => {
//   if (err.name === 'SequelizeUniqueConstraintError') {
//     const fields = Array.isArray(err.fields) ? err.fields : Object.keys(err.fields)
//
//     return res.status(409).json({ error: 'El valor ya existe', campo: fields.join(', ') })
//   }
//   res.status(err.status ?? 500).json({ error: err.message })
// })

export { app }
