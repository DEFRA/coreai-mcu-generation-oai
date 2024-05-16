const { listPersona } = require('../api/personas')

const getPersona = async (project = 'mcu', type, name) => {
  const persona = await listPersona(project, type, name)

  return persona
}

module.exports = {
  getPersona
}
