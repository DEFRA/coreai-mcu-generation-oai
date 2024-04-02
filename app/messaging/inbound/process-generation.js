const util = require('util')
const { validateGenerationMessage } = require('./generation-schema')
const { generateResponse } = require('../../lib/generation')

const processGenerationRequest = async (message, receiver) => {
  try {
    const { body } = validateGenerationMessage(message.body)

    console.log(`Processing response: ${util.inspect(body)}`)

    await generateResponse(body.document_id, body.user_prompt)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Error processing response:', err)

    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processGenerationRequest
}
