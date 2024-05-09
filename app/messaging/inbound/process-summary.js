const util = require('util')
const { validateSummaryMessage } = require('./summary-schema')
const { updateMetadata } = require('../../services/documents')
const { generateSummary } = require('../../services/ai/generation/summary')

const processSummaryRequest = async (message, receiver) => {
  try {
    const body = validateSummaryMessage(message.body)

    console.log(`Processing summary request: ${util.inspect(body)}`)

    const response = await generateSummary(body.document_id)
    await updateMetadata(body.document_id, response)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing request:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processSummaryRequest
}
