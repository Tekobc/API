// Validation middleware wrapper
export const validate = (validationFn) => (req, res, next) => {
  const result = validationFn(req.body);
  if (!result.valid) {
    return res.error(400, result.message);
  }
  next();
};
