import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { router as exampleRoute } from './routes/example.route.js'
import { router as usersRoute } from './routes/users.route.js'
import { router as postsRoute } from './routes/posts.route.js'
import { router as commentsRoute } from './routes/comments.route.js'
import { router as tagsRoute } from './routes/tags.route.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const swaggerYamlPath = path.join(__dirname, '..', 'swagger.yaml')
const swaggerYaml = fs.readFileSync(swaggerYamlPath, 'utf8')
const swaggerDocument = YAML.parse(swaggerYaml)

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api', exampleRoute)
app.use('/api', usersRoute)
app.use('/api', postsRoute)
app.use('/api', commentsRoute)
app.use('/api', tagsRoute)

app.use((err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ error: 'El valor ya existe', campo: Object.keys(err.fields).join(', ') })
  }
  res.status(err.status ?? 500).json({ error: err.message })

  next()
})

export { app }
