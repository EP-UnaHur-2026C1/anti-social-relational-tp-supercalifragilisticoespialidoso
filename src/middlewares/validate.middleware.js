export const validateMiddleware = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req.body)
  if (errors.length) return res.status(400).json({ errors })
  next()
}
