const Joi = require('joi')

const schema = Joi.object({
  documentsApi: Joi.object({
    baseUrl: Joi.string().required()
  }),
  responsesApi: Joi.object({
    baseUrl: Joi.string().required()
  }),
  promptsApi: Joi.object({
    baseUrl: Joi.string().required()
  }),
  personasApi: Joi.object({
    baseUrl: Joi.string().required()
  })
})

const config = {
  documentsApi: {
    baseUrl: process.env.DOCUMENTS_API_BASE_URL
  },
  responsesApi: {
    baseUrl: process.env.RESPONSES_API_BASE_URL
  },
  promptsApi: {
    baseUrl: process.env.PROMPTS_API_BASE_URL
  },
  personasApi: {
    baseUrl: process.env.PERSONAS_API_BASE_URL
  }
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The api config is invalid. ${error.message}`)
}

module.exports = value
