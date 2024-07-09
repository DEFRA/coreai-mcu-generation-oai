const { bedrock } = require('../../../config/ai').aws
const { BedrockChat } = require('@langchain/community/chat_models/bedrock')

const getBedrockClient = (model) => {
  if (!bedrock.enabled) {
    throw new Error('Bedrock is not enabled')
  }

  return new BedrockChat({
    model,
    region: bedrock.region,
    credentials: {
      accessKeyId: bedrock.accessKeyId,
      secretAccessKey: bedrock.secretAccessKey
    },
    modelKwargs: {
      max_tokens: bedrock.maxTokensToSample
    }
  })
}

module.exports = {
  getBedrockClient
}
