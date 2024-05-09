const { RunnablePassthrough, RunnableMap, RunnableLambda, RunnableSequence } = require('@langchain/core/runnables')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { formatDocumentsAsString } = require('langchain/util/document')
const { getVectorStore } = require('../../vector-store')
const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { prompts, types } = require('../../../../constants/prompts')

const getRetriever = async (knowledge) => {
  const vectorStore = await getVectorStore()

  if (!knowledge || knowledge.length === 0) {
    return vectorStore.asRetriever()
  }

  const filter = {
    filter: { documentId: { in: knowledge } }
  }

  return vectorStore.asRetriever(filter)
}

const buildGenerateChain = async (llm, prompt, knowledge) => {
  const retriever = await getRetriever(knowledge)

  let retrieveChain = new RunnableMap({
    steps: {
      context: new RunnableLambda({
        func: async (input) => {
          const documents = await retriever.invoke(input.document)

          return documents
        }
      }),
      document: (input) => input.document
    }
  })

  const chain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input) => formatDocumentsAsString(input.context)
    }),
    ChatPromptTemplate.fromTemplate(prompt),
    llm,
    new StringOutputParser()
  ])

  retrieveChain = retrieveChain.assign({ response: chain })

  return retrieveChain
}

const buildRefineChain = async (llm, prompt, knowledge) => {
  const retriever = await getRetriever(knowledge)

  let retrieveChain = new RunnableMap({
    steps: {
      context: new RunnableLambda({
        func: async (input) => {
          const documents = await retriever.invoke(input.document)

          return documents
        }
      }),
      operator_requests: (input) => input.operator_requests,
      previous_response: (input) => input.previous_response
    }
  })

  const chain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input) => formatDocumentsAsString(input.context)
    }),
    ChatPromptTemplate.fromTemplate(prompts[types.REFINE_PROMPT]),
    llm,
    new StringOutputParser()
  ])

  retrieveChain = retrieveChain.assign({ response: chain })

  return retrieveChain
}

module.exports = {
  buildGenerateChain,
  buildRefineChain
}