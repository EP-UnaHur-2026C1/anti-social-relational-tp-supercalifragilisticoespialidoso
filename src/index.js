import 'dotenv/config'
import { app } from './app.js'
import { sequelize } from './models/index.js'

const PORT = process.env.PORT || 3000

await sequelize.sync()

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
})
