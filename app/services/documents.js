const { format, parseISO } = require('date-fns')
const { getDocuments, getDocumentContents, getDocumentMetadata, updateDocumentMetadata } = require('../api/documents')

const formatDocument = (document) => {
  const date = parseISO(document.properties.createdOn)
  const formattedDate = format(date, 'dd/MM/yyyy')

  return {
    ...document,
    documentId: document.name,
    properties: {
      ...document.properties,
      createdOn: formattedDate
    }
  }
}

const formatDocuments = (documents) => {
  return documents.map(formatDocument)
}

const getDocumentsData = async () => {
  try {
    const documents = await getDocuments()

    return formatDocuments(documents)
  } catch (error) {
    console.error('There was a problem getting documents data', error)
    throw error
  }
}

const getDocumentContent = async (id) => {
  try {
    const document = await getDocumentContents(id)

    return document.toString()
  } catch (error) {
    console.error('There was a problem getting document contents', error)
    throw error
  }
}

const getDocumentData = async (id) => {
  try {
    const document = await getDocumentMetadata(id)

    return formatDocument(document)
  } catch (error) {
    console.error('There was a problem getting document data', error)
    throw error
  }
}

const updateMetadata = async (id, metadata) => {
  const payload = {
    author: metadata.author,
    keyPoints: metadata.keyPoints,
    keyFacts: metadata.keyFacts,
    sentiment: metadata.sentiment,
    suggestedCategory: metadata.suggestedCategory,
    summary: metadata.summary
  }

  try {
    await updateDocumentMetadata(id, payload)
  } catch (error) {
    console.error('There was a problem updating document metadata', error)
    throw error
  }
}

module.exports = {
  getDocumentsData,
  getDocumentContent,
  getDocumentData,
  updateMetadata
}
