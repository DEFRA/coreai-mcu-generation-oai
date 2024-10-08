const Joi = require('joi')
const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')

const tokenProvider = getBearerTokenProvider(
  new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID }),
  'https://ossrdbms-aad.database.windows.net/.default'
)

const schema = Joi.object({
  postgresConnectionOptions: Joi.object({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    password: Joi.alternatives().try(
      Joi.string(),
      Joi.func()
    ).required(),
    database: Joi.string().required(),
    ssl: Joi.boolean().required()
  }).required(),
  tableName: Joi.string().default('mcu_knowledge_vectors'),
  columns: Joi.object({
    idColumnName: Joi.string().default('id'),
    vectorColumnName: Joi.string().default('vector'),
    contentColumnName: Joi.string().default('content'),
    metadataColumnName: Joi.string().default('metadata')
  })
})

const config = {
  postgresConnectionOptions: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.NODE_ENV === 'production' ? tokenProvider : process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === 'production'
  },
  tableName: 'mcu_knowledge_vectors',
  columns: {
    idColumnName: 'id',
    vectorColumnName: 'vector',
    contentColumnName: 'content',
    metadataColumnName: 'metadata'
  }
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error('Postgres config validation error: ', error)
}

module.exports = {
  config: value
}
