const { MessageSender } = require('ffc-messaging')
const { responseProcessingQueue } = require('../../config/messaging')
const { LLM_RESPONSE } = require('../../constants/events')

const createMessage = (data) => ({
  body: {
    document_id: data.documentId,
    llm: data.modelId,
    user_prompt: data.userPrompt,
    knowledge: data.knowledge,
    citations: data.citations,
    response: data.response
  },
  type: LLM_RESPONSE,
  source: 'coreai-mcu-generation-oai'
})

const sendResponse = async (data) => {
  const sender = new MessageSender(responseProcessingQueue)

  const message = createMessage(data)

  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendResponse
}
