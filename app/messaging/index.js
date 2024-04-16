const { MessageReceiver } = require('ffc-messaging')
const { generationSubscription, summarySubscription } = require('../config/messaging')
const { processGenerationRequest } = require('./inbound/process-generation')
const { processSummaryRequest } = require('./inbound/process-summary')

let generationReceiver
let summaryReceiver

const start = async () => {
  const generationAction = message => processGenerationRequest(message, generationReceiver)
  generationReceiver = new MessageReceiver(generationSubscription, generationAction)
  await generationReceiver.subscribe()

  const summaryAction = message => processSummaryRequest(message, summaryReceiver)
  summaryReceiver = new MessageReceiver(summarySubscription, summaryAction)
  await summaryReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await generationReceiver.closeConnection()
  await summaryReceiver.closeConnection()
}

module.exports = { start, stop }
