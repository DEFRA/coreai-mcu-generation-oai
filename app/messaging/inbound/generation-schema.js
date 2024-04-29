const Joi = require('joi')

const schema = Joi.object({
  document_id: Joi.string().uuid().required(),
  knowledge: Joi.array().required(),
  model_id: Joi.string().required(),
  prompt_id: Joi.string().required(),
  user_prompt: Joi.string().allow('').required(),
  project_name: Joi.string().required(),
  type: Joi.string().required().allow('correspondence', 'briefing')
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
