const util = require('util')
const { validateGenerationMessage } = require('./generation-schema')
const { generateResponse } = require('../../services/ai/generation')
const { sendResponse } = require('../outbound/llm-response')

const processGenerationRequest = async (message, receiver) => {
  try {
    const body = validateGenerationMessage(message.body)

    console.log(`Processing generation request: ${util.inspect(body)}`)

    const response = await generateResponse(body)
    await sendResponse(response)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing request:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processGenerationRequest
}
