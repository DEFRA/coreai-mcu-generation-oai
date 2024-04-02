const { get } = require('./base')
const { responsesApi: config } = require('../config/api')

const baseUrl = config.baseUrl

const getResponses = async (docId) => {
  return get(`${baseUrl}/responses/${docId}`)
}

module.exports = {
  getResponses
}
