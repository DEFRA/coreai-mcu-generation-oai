const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { prompts, types } = require('../constants/prompts')
const { generation } = require('../lib/ai')
const { getVectorStore } = require('../lib/vector-store')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { formatDocumentsAsString } = require('langchain/util/document')
const { RunnableMap, RunnableLambda, RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables')

const buildPrompt = () => {
  const prompt = ChatPromptTemplate.fromTemplate(prompts[types.SYSTEM_PROMPT])

  return prompt
}

const generateResponse = async (documentId, userPrompt) => {
  const retriever = (await getVectorStore()).asRetriever()

  const prompt = buildPrompt(userPrompt)

  // TODO: Create function to load document from Documents service via API call
  const document = 'What is SFI?'

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
      })
    }
  })

  retrieveChain = retrieveChain.assign({ response: chain })

  const result = await retrieveChain.invoke({
    document,
    requests: userPrompt
  })

  return {
    documentId,
    response: result.response,
    citations: result.context,
    userPrompt
  }
}

module.exports = {
  generateResponse
}