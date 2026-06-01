export const postMiddleware = (req, res, next) => {
  const id = req.params.id
  if (id && isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'ID debe ser un número' })
  }
  next()
}
