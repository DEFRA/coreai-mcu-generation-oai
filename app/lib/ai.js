const { AzureOpenAIEmbeddings, AzureChatOpenAI } = require('@langchain/azure-openai')
const aiConfig = require('../config/ai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get embeddings: ${error}`)
  }
}

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey: aiConfig.azureOpenAIApiKey,
  azureOpenAIApiDeploymentName: aiConfig.azureOpenAIApiDeploymentNameEmbeddings,
  azureOpenAIEndpoint: aiConfig.azureOpenAIEndpoint,
  modelName: aiConfig.azureOpenAIApiModelNameEmbeddings,
  onFailedAttempt
})

const generation = new AzureChatOpenAI({
  temperature: 0.9,
  azureOpenAIApiKey: aiConfig.azureOpenAIApiKey,
  azureOpenAIApiDeploymentName: aiConfig.azureOpenAIApiDeploymentNameGenerate,
  azureOpenAIEndpoint: aiConfig.azureOpenAIEndpoint,
  modelName: aiConfig.azureOpenAIApiModelNameGenerate,
  onFailedAttempt
})

module.exports = {
  embeddings,
  generation
}
