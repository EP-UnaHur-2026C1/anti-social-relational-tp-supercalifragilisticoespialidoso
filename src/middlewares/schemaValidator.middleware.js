export const schemaValidator = (schema) => (req, res, next) => {
  const result = schema.validate(req.body, { abortEarly: false })
  if (result.error) {
    return res.status(400).json({
      errores: result.error.details.map((e) => ({
        atributo: e.path[0],
        error: e.message,
      })),
    })
  }
  next()
}
