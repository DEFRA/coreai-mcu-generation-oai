const { MessageReceiver } = require('ffc-messaging')
const { generationSubscription } = require('../config/messaging')
const { processGenerationRequest } = require('./inbound/process-generation')

let generationReceiver

const start = async () => {
  const generationAction = message => processGenerationRequest(message, generationReceiver)
  generationReceiver = new MessageReceiver(generationSubscription, generationAction)
  await generationReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await generationReceiver.closeConnection()
}

module.exports = { start, stop }
