const Joi = require('joi')

const schema = Joi.object({
  body: Joi.object({
    document_id: Joi.string().uuid().required(),
    user_prompt: Joi.string().allow('').required(),
    knowledge: Joi.array().required()
  }).required(),
  source: Joi.string().required(),
  type: Joi.string().required()
})

const validateGenerationMessage = (request) => {
  const { value, error } = schema.validate(request)

  if (error) {
    throw new Error(`Invalid response message: ${error.message}`)
  }

  return value
}

module.exports = {
  validateGenerationMessage
}
