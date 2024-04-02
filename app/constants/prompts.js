const types = {
  SYSTEM_PROMPT: 'system'
}

const systemPrompt = `You are a expert in writing responses to correspondence from ministers and the general public. You have been asked to provide a response to the following document:
{document}

The user may also make requests that you should incorporate into your response.

Additional requests: {requests}
`

const prompts = {
  [types.SYSTEM_PROMPT]: systemPrompt
}

module.exports = {
  types,
  prompts
}
