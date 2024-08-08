const { openAi } = require('../../../config/ai').azure
const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')
const { AzureChatOpenAI, AzureOpenAIEmbeddings } = require('@langchain/openai')

const tokenProvider = getBearerTokenProvider(
  new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID }),
  'https://cognitiveservices.azure.com/.default'
)

const getConfig = () => {
  const config = {
    azureOpenAIApiVersion: openAi.apiVersion,
    azureOpenAIApiInstanceName: openAi.instanceName,
    onFailedAttempt,
    verbose: process.env.NODE_ENV === 'development'
  }

  if (openAi.apiKey) {
    console.log('Using Azure OpenAI API key')

    return {
      ...config,
      azureOpenAIApiKey: openAi.apiKey
    }
  }

  console.log('Using managed identity')

  return {
    ...config,
    azureADTokenProvider: tokenProvider
  }
}

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get Azure model: ${error}`)
  }
}

const getOpenAiClient = (model) => {
  if (!openAi.enabled) {
    throw new Error('Azure OpenAI is not enabled')
  }

  const config = {
    azureOpenAIApiDeploymentName: model,
    ...getConfig()
  }

  return new AzureChatOpenAI(config)
}

const getOpenAiEmbeddingsClient = (model) => {
  const config = {
    azureOpenAIApiEmbeddingsDeploymentName: model,
    ...getConfig()
  }

  return new AzureOpenAIEmbeddings(config)
}

module.exports = {
  getOpenAiClient,
  getOpenAiEmbeddingsClient
}
