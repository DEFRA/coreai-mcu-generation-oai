const { getDocumentContent } = require('../../documents')
const { getAllResponses } = require('../../responses')
const { getPrompt } = require('../../prompts')
const { getClient } = require('../clients')
const { buildGenerateChain, buildRefineChain } = require('./chains/response')

const getPreviousResponse = async (documentId) => {
  const responses = await getAllResponses(documentId)

  return responses[0] ?? ''
}

const generateInitialResponse = async (llm, prompt, knowledge, documentId) => {
  const document = await getDocumentContent(documentId)

  const chain = await buildGenerateChain(llm, prompt, knowledge)

  const generate = await chain.invoke({
    document
  })

  return generate
}

const generateRefinedResponse = async (llm, prompt, userPrompt, knowledge, documentId, previousResponse) => {
  const document = await getDocumentContent(documentId)

  const chain = await buildRefineChain(llm, prompt, knowledge)

  const generate = await chain.invoke({
    document,
    operator_requests: userPrompt,
    previous_response: previousResponse.response
  })

  return generate
}

const generateResponse = async (data) => {
  const { prompt } = await getPrompt(data.project_name, data.model_id, data.type, data.prompt_id)

  const llm = getClient(data.model_id)

  const documentId = data.document_id
  const userPrompt = data.user_prompt

  const previousResponse = await getPreviousResponse(documentId)

  let generate

  if (!previousResponse) {
    console.log('Generating initial response')
    generate = await generateInitialResponse(llm, prompt, data.knowledge, documentId)
  } else {
    console.log('Generating refined response')
    generate = await generateRefinedResponse(llm, prompt, userPrompt, data.knowledge, documentId, previousResponse)
  }

  return {
    documentId,
    response: generate.response,
    citations: generate.context,
    userPrompt
  }
}

module.exports = {
  generateResponse
}
