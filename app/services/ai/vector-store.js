const { openAi } = require('../../config/ai').azure
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { config } = require('../../config/db')
const { getOpenAiEmbeddingsClient } = require('./clients/azure')

const embeddings = getOpenAiEmbeddingsClient(openAi.embeddingsModelName)

const vectorStore = new PGVectorStore(
  embeddings,
  config
)

const getRetriever = (knowledge) => {
  if (!knowledge || knowledge.length === 0) {
    return vectorStore.asRetriever(10)
  }

  const filter = {
    filter: { documentId: { in: knowledge } }
  }

  return vectorStore.asRetriever(10, filter)
}

module.exports = {
  vectorStore,
  getRetriever
}
