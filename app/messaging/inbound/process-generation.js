const util = require('util')
const { validateGenerationMessage } = require('./generation-schema')
const { generateResponse } = require('../../services/ai/generation/response')
const { sendResponse } = require('../outbound/llm-response')
const { updateStatus } = require('../../services/documents')
const status = require('../../constants/document-status')

const processGenerationRequest = async (message, receiver) => {
  let documentId

  try {
    const body = validateGenerationMessage(message.body)
    documentId = body.document_id

    console.log(`Processing generation request: ${util.inspect(body)}`)

    await updateStatus(documentId, status.GENERATING)

    const response = await generateResponse(body)

    await sendResponse(response)

    await updateStatus(documentId, status.IN_PROGRESS)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing generation request:', err)

    await receiver.deadLetterMessage(message)

    if (documentId) {
      await updateStatus(documentId, status.FAILED)
    }
  }
}

module.exports = {
  processGenerationRequest
}
