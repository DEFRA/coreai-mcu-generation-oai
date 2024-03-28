const { MessageReceiver } = require('ffc-messaging')
const { generationSubscription } = require('../config/messaging')

let responseReceiver

const start = async () => {
  const generationAction = message => console.log(message.body)
  responseReceiver = new MessageReceiver(generationSubscription, generationAction)
  await responseReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await responseReceiver.closeConnection()
}

module.exports = { start, stop }
