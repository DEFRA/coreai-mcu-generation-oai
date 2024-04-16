const { MessageSender } = require('ffc-messaging')
const { responseProcessingQueue } = require('../../config/messaging')
const { LLM_RESPONSE } = require('../../constants/events')

const createMessage = (data) => ({
  body: {
    document_id: data.documentId,
    llm: 'GPT3.5',
    user_prompt: data.userPrompt,
    knowledge: data.knowledge,
    citations: data.citations,
    response: data.response,
    document_summary: {
      author: data.summary.author,
      title: data.summary.title,
      summary: data.summary.summary,
      key_points: data.summary.key_points,
      key_facts: data.summary.key_facts,
      sentiment: data.summary.sentiment,
      category: data.summary.category
    }
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