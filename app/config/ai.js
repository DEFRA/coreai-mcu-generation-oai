const Joi = require('joi')

const schema = Joi.object({
  instanceName: Joi.string().required(),
  apiKey: Joi.string().required(),
  embeddingsModelName: Joi.string().required(),
  generationModelName: Joi.string().required(),
  apiVersion: Joi.string().required(),
  awsKey: Joi.string().required(),
  awsSecret: Joi.string().required()
})

const config = {
  instanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
  apiKey: process.env.AZURE_OPENAI_KEY,
  embeddingsModelName: process.env.EMBEDDING_MODEL_NAME,
  generationModelName: process.env.GENERATION_MODEL_NAME,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  awsKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The AI config is invalid. ${error.message}`)
}

module.exports = value
