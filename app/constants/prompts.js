const types = {
  SYSTEM_PROMPT: 'system'
}

const systemPrompt = `You are a expert in writing responses to correspondence from ministers and the general public. You have been asked to provide a response to the following document:
Document: {document}

Respond to the document based only on the following context:
{context}
`

const prompts = {
  [types.SYSTEM_PROMPT]: systemPrompt
}

module.exports = {
  types,
  prompts
}
