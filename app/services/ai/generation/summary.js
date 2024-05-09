const { getDocumentContent } = require('../../documents')
const { buildSummaryChain } = require('./chains/summary')

const generateSummary = async (documentId) => {
  const document = await getDocumentContent(documentId)

  const chain = buildSummaryChain()

  const summary = await chain.invoke({
    document
  })

  return summary
}

module.exports = {
  generateSummary
}
