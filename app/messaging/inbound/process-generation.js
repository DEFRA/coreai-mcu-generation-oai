const util = require('util')
const { validateGenerationMessage } = require('./generation-schema')
const { generateResponse } = require('../../services/ai/generation/response')
const { sendResponse } = require('../outbound/llm-response')
const { updateStatus } = require('../../services/documents')
const status = require('../../constants/document-status')

const processGenerationRequest = async (message, receiver) => {
  try {
    const body = validateGenerationMessage(message.body)

    console.log(`Processing generation request: ${util.inspect(body)}`)

    await updateStatus(body.document_id, status.GENERATING)

    const response = await generateResponse(body)

    await sendResponse(response)
    await updateStatus(body.document_id, status.IN_PROGRESS)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing request:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processGenerationRequest
}
