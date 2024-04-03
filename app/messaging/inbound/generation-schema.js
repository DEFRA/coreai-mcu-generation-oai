const Joi = require('joi')

const schema = Joi.object({
  document_id: Joi.string().uuid().required(),
  user_prompt: Joi.string().allow('').required(),
  knowledge: Joi.array().required()
}).required()

const validateGenerationMessage = (request) => {
  const { value, error } = schema.validate(request)

  if (error) {
    throw new Error(`Invalid generation message: ${error.message}`)
  }

  return value
}

module.exports = {
  validateGenerationMessage
}
