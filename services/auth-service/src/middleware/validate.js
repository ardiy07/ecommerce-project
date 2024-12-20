const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => {
        return {
          message: err.message,
          path: err.path.join("."),
        };
      });

      return res.status(400).json({
        status: "failed",
        message: errors,
      });
    }
    next();
  };
};

module.exports = validate;
