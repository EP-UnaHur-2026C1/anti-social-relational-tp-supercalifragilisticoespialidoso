import express from 'express'
import { router as exampleRoute } from './routes/example.route.js'

const app = express()

app.use(express.json())

app.use('/api', exampleRoute)

app.use((err, req, res) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ error: 'El valor ya existe', campo: Object.keys(err.fields).join(', ') })
  }
  res.status(err.status ?? 500).json({ error: err.message })
})

export { app }
