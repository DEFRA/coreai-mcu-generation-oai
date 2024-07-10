const { openAi } = require('../../../config/ai').azure
const { DefaultAzureCredential } = require('@azure/identity')
const { AzureChatOpenAI } = require('@langchain/azure-openai')

const getConfig = (model) => {
  const config = {
    azureOpenAIApiDeploymentName: model,
    azureOpenAIApiVersion: openAi.apiVersion,
    azureOpenAIApiInstanceName: openAi.instanceName,
    onFailedAttempt,
    verbose: true
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
    credentials: new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
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

  return new AzureChatOpenAI(getConfig(model))
}

module.exports = {
  getOpenAiClient
}
