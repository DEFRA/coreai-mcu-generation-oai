const { openAi } = require('../../../config/ai').azure
const { ChatOpenAI } = require('@langchain/openai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get Azure model: ${error}`)
  }
}

const getOpenAiClient = (model) => {
  if (!openAi.enabled) {
    throw new Error('Azure OpenAI is not enabled')
  }
  
  return new ChatOpenAI({
    azureOpenAIApiInstanceName: openAi.instanceName,
    azureOpenAIApiKey: openAi.apiKey,
    azureOpenAIApiDeploymentName: model,
    azureOpenAIApiVersion: openAi.apiVersion,
    onFailedAttempt,
    verbose: true
  })
}

module.exports = {
  getOpenAiClient
}
