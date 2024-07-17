const { getOpenAiClient } = require('./azure')
const { getBedrockClient } = require('./aws')
const { getOllamaClient } = require('./ollama')

const clients = {
  'azure|openai': getOpenAiClient,
  'aws|bedrock': getBedrockClient,
  'ollama|ollama': getOllamaClient
}

const getClient = (modelId) => {
  const [vendor, service, model] = modelId.split('|')

  const client = clients[`${vendor}|${service}`]

  if (!client) {
    throw new Error(`Client not found for model ${modelId}`)
  }

  return client(model)
}

module.exports = {
  getClient
}
