const joi = require("joi");

const sendOTPSchema = joi.object({
    email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email format",
    }),
});

module.exports = sendOTPSchema;