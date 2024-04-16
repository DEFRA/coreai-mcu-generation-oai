const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { prompts, types } = require('../constants/prompts')
const { generation } = require('../lib/ai')
const { getVectorStore } = require('../lib/vector-store')
const { StringOutputParser, JsonOutputParser } = require('@langchain/core/output_parsers')
const { formatDocumentsAsString } = require('langchain/util/document')
const { RunnableMap, RunnableLambda, RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables')
const { getDocumentContent } = require('../services/documents')
const { getAllResponses } = require('../services/responses')

const buildGenerateChain = async (knowledge) => {
  const vectorStore = await getVectorStore()
  let retriever
  if (knowledge && knowledge.length > 0) {
    const filter = {
      filter: { "documentId": { "in": knowledge } }
    }

    retriever = vectorStore.asRetriever(filter)
  } else {
    retriever = vectorStore.asRetriever()
  }

  const prompt = ChatPromptTemplate.fromTemplate(prompts[types.GENERATE_PROMPT])

  const chain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input) => formatDocumentsAsString(input.context)
    }),
    prompt,
    generation,
    new StringOutputParser()
  ])

  let retrieveChain = new RunnableMap({
    steps: {
      context: new RunnableLambda({
        func: async (input) => {
          const documents = await retriever.invoke(input.document)

          return documents
        }
      }),
      document: new RunnableLambda({
        func: (input) => input.document,
      }),
      requests: new RunnableLambda({
        func: (input) => input.requests
      }),
      previous_response: new RunnableLambda({
        func: (input) => input.previous_response
      })
    }
  })

  retrieveChain = retrieveChain.assign({ response: chain })

  return retrieveChain
}

const buildSummaryChain = () => {
  const prompt = ChatPromptTemplate.fromTemplate(prompts[types.SUMMARISE_PROMPT])

  const chain = RunnableSequence.from([
    RunnablePassthrough.assign({
      document: (input) => input.document
    }),
    prompt,
    generation,
    new JsonOutputParser()
  ])

  return chain
}

const getPreviousResponse = async (documentId) => {
  const responses = await getAllResponses(documentId)

  const { response } = responses[0] ?? ''

  return response
}

const generateResponse = async (documentId, userPrompt, knowledge) => {
  const document = await getDocumentContent(documentId)

  const previousResponse = await getPreviousResponse(documentId)

  const generateChain = await buildGenerateChain(knowledge)
  const summaryChain = buildSummaryChain()

  const chain = RunnableMap.from({
    generate: generateChain,
    summary: summaryChain
  })

  const { generate, summary } = await chain.invoke({
    document,
    requests: userPrompt,
    previous_response: previousResponse
  })

  return {
    documentId,
    response: generate.response,
    citations: generate.context,
    summary,
    userPrompt
  }
}

module.exports = {
  generateResponse
}
