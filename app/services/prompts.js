const { listPrompt } = require('../api/prompts')

const getPrompt = async (project = 'mcu', model, type, name) => {
  const responses = await listPrompt(project, model, type, name)

  return responses
}

module.exports = {
  getPrompt
}
