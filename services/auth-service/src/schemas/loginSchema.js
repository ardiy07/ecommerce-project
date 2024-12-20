const joi = require("joi");

const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email format",
    }),
    password: joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
    }),
});

module.exports = loginSchema;