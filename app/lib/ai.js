const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai')
const { BedrockChat } = require('@langchain/community/chat_models/bedrock')
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

const generation = new ChatOpenAI({
  azureOpenAIApiInstanceName: aiConfig.instanceName,
  azureOpenAIApiKey: aiConfig.apiKey,
  azureOpenAIApiDeploymentName: aiConfig.generationModelName,
  azureOpenAIApiVersion: aiConfig.apiVersion,
  onFailedAttempt
})

const awsGeneration = new BedrockChat({
  model: "anthropic.claude-v2:1",
  region: "eu-central-1",
  credentials: {
    accessKeyId: aiConfig.awsKey,
    secretAccessKey: aiConfig.awsSecret
  },
  modelKwargs: {
    max_tokens_to_sample: 4000
  }
})

module.exports = {
  embeddings,
  generation,
  awsGeneration
}
