const fs = require('fs');
const Joi = require('joi');

// ---------- Schemas ----------
const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string().trim().email().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const photoSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(1000).allow('').optional(),
});

const commentSchema = Joi.object({
  comment: Joi.string().trim().max(500).required(),
});

// ---------- Middleware factory ----------
// validate(schema) checks req.body. On failure: 400 and (if a file was
// uploaded) the file is deleted so no orphan stays in /uploads.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  photoSchema,
  commentSchema,
};
