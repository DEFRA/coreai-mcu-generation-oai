const { OpenAIEmbeddings, AzureOpenAI } = require('@langchain/openai')
const aiConfig = require('../config/ai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get embeddings: ${error}`)
  }
}

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: aiConfig.instanceName,
  azureOpenAIApiKey: aiConfig.apiKey,
  azureOpenAIApiDeploymentName: aiConfig.embeddingsModelName,
  azureOpenAIApiVersion: aiConfig.apiVersion,
  onFailedAttempt
})

const generation = new AzureOpenAI({
  azureOpenAIApiInstanceName: aiConfig.instanceName,
  azureOpenAIApiKey: aiConfig.apiKey,
  azureOpenAIApiDeploymentName: aiConfig.embeddingsModelName,
  azureOpenAIApiVersion: aiConfig.apiVersion,
  onFailedAttempt
})

module.exports = {
  embeddings,
  generation
}
