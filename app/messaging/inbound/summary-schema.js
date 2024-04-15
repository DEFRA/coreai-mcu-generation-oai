const Joi = require('joi')

const schema = Joi.object({
  document_id: Joi.string().uuid().required()
}).required()

const validateSummaryMessage = (request) => {
  const { value, error } = schema.validate(request)

  if (error) {
    throw new Error(`Invalid summary message: ${error.message}`)
  }

  return value
}

module.exports = {
  validateSummaryMessage
}