const { openAi } = require('../../../config/ai').azure
const { getOpenAiClient } = require('./azure')
const { getOllamaClient } = require('./ollama')

const clients = {
  'azure:openai': getOpenAiClient,
  'ollama:ollama': getOllamaClient
}

const getClient = (modelId) => {
  const [vendor, service, model] = modelId.split(':')

  const client = clients[`${vendor}:${service}`]

  if (!client) {
    throw new Error(`Client not found for model ${modelId}`)
  }

  return client(model)
}

const generation = getClient(`azure:openai:${openAi.generationModelName}`)

const embeddings = {}

module.exports = {
  getClient,
  generation,
  embeddings
}
