const util = require('util')
const { validateSummaryMessage } = require('./summary-schema')
const { generateSummary } = require('../../lib/generation')

const processSummaryRequest = async (message, receiver) => {
  try {
    const body = validateSummaryMessage(message.body)

    console.log(`Processing summary request: ${util.inspect(body)}`)

    const response = await generateSummary(body.document_id, body.user_prompt)
    console.log(response)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing request:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processSummaryRequest
}