const Joi = require('joi')

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string(),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const schema = Joi.object({
  generationSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().required(),
    ...sharedConfigSchema
  },
  responseProcessingQueue: {
    address: Joi.string().required(),
    type: Joi.string().required(),
    ...sharedConfigSchema
  },
  summarySubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().required(),
    ...sharedConfigSchema
  }
})

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.MESSAGE_QUEUE_HOST,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  username: process.env.MESSAGE_QUEUE_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const config = {
  generationSubscription: {
    address: process.env.GENERATION_REQUEST_OAI_SUBSCRIPTION,
    topic: process.env.GENERATION_REQUEST_TOPIC,
    type: 'subscription',
    ...sharedConfig
  },
  responseProcessingQueue: {
    address: process.env.RESPONSE_PROCESSING_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  summarySubscription: {
    address: process.env.GENERATION_REQUEST_OAI_SUBSCRIPTION,
    topic: process.env.SUMMARY_REQUEST_TOPIC,
    type: 'subscription',
    ...sharedConfig
  }
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The message queue config is invalid. ${error.message}`)
}

module.exports = value
