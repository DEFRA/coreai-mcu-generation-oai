const { format, parseISO } = require('date-fns')
const { getResponses } = require('../api/responses')

const formatResponse = (response) => {
  const date = parseISO(response.timestamp)
  const generatedOn = format(date, 'dd/MM/yyyy HH:mm')

  return {
    response: response.response,
    documentId: response.document_id,
    llm: response.llm,
    userPrompt: response.user_prompt,
    citations: response.citations,
    generatedOn
  }
}

const getLatestResponse = async (documentId) => {
  const responses = await getResponses(documentId)

  if (responses.length === 0) {
    return []
  }

  return formatResponse(responses[0])
}

const getAllResponses = async (id) => {
  const responses = await getResponses(id)

  return responses.map(formatResponse)
}

module.exports = {
  getLatestResponse,
  getAllResponses
}
