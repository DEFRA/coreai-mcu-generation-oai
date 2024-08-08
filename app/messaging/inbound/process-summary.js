const util = require('util')
const { validateSummaryMessage } = require('./summary-schema')
const { updateMetadata, updateStatus } = require('../../services/documents')
const { generateSummary } = require('../../services/ai/generation/summary')
const status = require('../../constants/document-status')

const processSummaryRequest = async (message, receiver) => {
  let documentId

  try {
    const body = validateSummaryMessage(message.body)
    documentId = body.document_id

    console.log(`Processing summary request: ${util.inspect(body)}`)

    await updateStatus(documentId, status.TRIAGING)

    const response = await generateSummary(documentId)

    await updateMetadata(documentId, {
      ...response,
      status: status.NOT_STARTED
    })

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing request:', err)

    await receiver.deadLetterMessage(message)

    if (documentId) {
      await updateStatus(documentId, status.FAILED)
    }
  }
}

module.exports = {
  processSummaryRequest
}
