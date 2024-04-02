const Joi = require('joi')

const schema = Joi.object({
  azureOpenAIApiKey: Joi.string().required(),
  azureOpenAIApiVersion: Joi.string().required(),
  azureOpenAIApiModelNameEmbeddings: Joi.string().required(),
  azureOpenAIApiDeploymentNameEmbeddings: Joi.string().required(),
  azureOpenAIApiModelNameGenerate: Joi.string().required(),
  azureOpenAIApiDeploymentNameGenerate: Joi.string().required(),
  azureOpenAIBasePath: Joi.string().required(),
  azureOpenAIEndpoint: Joi.string().required()
})

const config = {
  azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiModelNameEmbeddings: process.env.AZURE_OPENAI_API_MODEL_NAME_EMBEDDINGS,
  azureOpenAIApiDeploymentNameEmbeddings: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_EMBEDDINGS,
  azureOpenAIApiModelNameGenerate: process.env.AZURE_OPENAI_API_MODEL_NAME_GENERATE,
  azureOpenAIApiDeploymentNameGenerate: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_GENERATE,
  azureOpenAIBasePath: process.env.AZURE_OPENAI_BASE_PATH,
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The storage config is invalid. ${error.message}`)
}

module.exports = value
