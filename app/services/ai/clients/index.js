const { openAi } = require('../../../config/ai').azure
const { getOpenAiClient } = require('./azure')
const { getBedrockClient } = require('./aws')
const { getOllamaClient } = require('./ollama')

const clients = {
  'azure:openai': getOpenAiClient,
  'aws:bedrock': getBedrockClient,
  'ollama:ollama': getOllamaClient
}

const getClient = (modelId) => {
  let [vendor, service, model] = modelId.split(':')
  if (service.indexOf('|') > -1 && !model) {
    model = service.substr(service.indexOf('|') + 1)
    service = service.substr(0, service.indexOf('|'))
  }

  const client = clients[`${vendor}:${service}`]

  if (!client) {
    throw new Error(`Client not found for model ${modelId}`)
  }

  return client(model)
}

const generation = getClient(`azure:openai:${openAi.generationModelName}`)

module.exports = {
  getClient,
  generation
}
