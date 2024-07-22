const { openAi } = require('../../config/ai').azure
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { config } = require('../../config/db')
const { getOpenAiEmbeddingsClient } = require('./clients/azure')

const embeddings = getOpenAiEmbeddingsClient(openAi.embeddingsModelName)

const vectorStore = new PGVectorStore(
  embeddings,
  config
)

module.exports = {
  vectorStore
}
