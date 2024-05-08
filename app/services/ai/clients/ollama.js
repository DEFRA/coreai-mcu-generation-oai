const { ollama } = require('../../../config/ai')
const { ChatOllama } = require('@langchain/community/chat_models/ollama')

const getOllamaClient = (model) => {
  if (!ollama.enabled) {
    throw new Error('Ollama is not enabled')
  }

  return new ChatOllama({
    baseUrl: ollama.baseUrl,
    model
  })
}

module.exports = {
  getOllamaClient
}
