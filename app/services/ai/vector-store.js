const { openAi } = require('../../config/ai').azure
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { OpenAIEmbeddings } = require('@langchain/openai')
const { getConfig } = require('../../config/db')

let vectorStore

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: openAi.instanceName,
  azureOpenAIApiKey: openAi.apiKey,
  azureOpenAIApiEmbeddingsDeploymentName: openAi.embeddingsModelName,
  azureOpenAIApiVersion: openAi.apiVersion
})

const getVectorStore = async () => {
  if (vectorStore) {
    console.log('Returning existing vector store')
    return vectorStore
  }

  console.log('Initializing new vector store')

  vectorStore = new PGVectorStore(
    embeddings,
    await getConfig()
  )

  return vectorStore
}

module.exports = {
  getVectorStore
}
