const { get } = require('./base')
const { promptsApi: config } = require('../config/api')

const baseUrl = config.baseUrl

const listPrompt = async (project = 'mcu', model, type, name) => {
  return get(`${baseUrl}/prompts/${project}/${model}/${type}/${name}`)
}

module.exports = {
  listPrompt
}
