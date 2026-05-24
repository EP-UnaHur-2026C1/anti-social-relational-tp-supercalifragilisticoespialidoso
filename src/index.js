import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
  // Descomentar para recrear las tablas (borra los datos existentes):
  // await db.sequelize.sync({ force: true });
})
