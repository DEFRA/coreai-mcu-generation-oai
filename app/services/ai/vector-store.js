const { openAi } = require('../../config/ai').azure
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { getConfig } = require('../../config/db')
const { getOpenAiEmbeddingsClient } = require('./clients/azure')

let vectorStore

const embeddings = getOpenAiEmbeddingsClient(openAi.embeddingsModelName)

const getVectorStore = async () => {
  vectorStore = new PGVectorStore(
    embeddings,
    await getConfig()
  )

  return vectorStore
}

module.exports = {
  getVectorStore
}
