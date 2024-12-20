const joi = require("joi");

const registerSchema = joi.object({
    email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email format",
    }),
    password: joi.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 6 characters long",
    }),
});

module.exports = registerSchema;