const { get } = require('./base')
const { personasApi: config } = require('../config/api')

const baseUrl = config.baseUrl

const listPersona = async (project = 'mcu', type, name) => {
  return get(`${baseUrl}/personas/${project}/${type}/${name}`)
}

module.exports = {
  listPersona
}
