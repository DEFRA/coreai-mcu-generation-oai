const Joi = require('joi')

const schema = Joi.object({
  azure: Joi.object({
    openAi: Joi.object({
      enabled: Joi.boolean().required(),
      instanceName: Joi.string().required(),
      apiKey: Joi.string().required(),
      embeddingsModelName: Joi.string().required(),
      generationModelName: Joi.string().required(),
      apiVersion: Joi.string().required()
    }).required()
  }).required(),
  ollama: Joi.object({
    enabled: Joi.boolean().required(),
    baseUrl: Joi.string().when('enabled', { is: true, then: Joi.required() })
  }).required()
})

const config = {
  azure: {
    openAi: {
      enabled: process.env.AZURE_OPENAI_ENABLED === 'true',
      instanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
      apiKey: process.env.AZURE_OPENAI_KEY,
      embeddingsModelName: process.env.EMBEDDING_MODEL_NAME,
      generationModelName: process.env.GENERATION_MODEL_NAME,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION
    }
  },
  ollama: {
    enabled: process.env.OLLAMA_ENABLED === 'true',
    baseUrl: process.env.OLLAMA_BASE_URL
  }
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The AI config is invalid. ${error.message}`)
}

module.exports = value
