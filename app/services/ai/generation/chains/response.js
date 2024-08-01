const { RunnablePassthrough, RunnableMap, RunnableLambda, RunnableSequence } = require('@langchain/core/runnables')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { formatDocumentsAsString } = require('langchain/util/document')
const { getRetriever } = require('../../vector-store')
const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { prompts, types } = require('../../../../constants/prompts')

const buildGenerateChain = async (llm, prompt, knowledge) => {
  const retriever = getRetriever(knowledge)

  const retrieve = RunnableMap.from({
    context: async (input) => {
      const documents = await retriever.invoke(input.document)

      return documents
    },
    document: (input) => input.document,
    persona: (input) => input.persona
  })

  const generate = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input) => formatDocumentsAsString(input.context)
    }),
    ChatPromptTemplate.fromTemplate(prompt),
    llm,
    new StringOutputParser()
  ])

  return retrieve.assign({ response: generate })
}

const buildRefineChain = async (llm, prompt, knowledge) => {
  const retriever = getRetriever(knowledge)

  const retrieve = RunnableMap.from({
    context: async (input) => {
      const documents = await retriever.invoke(`${input.document} ${input.operator_requests}`)

      return documents
    },
    operator_requests: (input) => input.operator_requests,
    previous_response: (input) => input.previous_response,
    persona: (input) => input.persona
  })

  const refine = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input) => formatDocumentsAsString(input.context)
    }),
    ChatPromptTemplate.fromTemplate(prompts[types.REFINE_PROMPT]),
    llm,
    new StringOutputParser()
  ])

  return retrieve.assign({ response: refine })
}

module.exports = {
  buildGenerateChain,
  buildRefineChain
}
