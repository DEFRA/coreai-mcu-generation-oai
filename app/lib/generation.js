//const { AzureChatOpenAI } = require('@langchain/azure-openai')
const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { formatDocumentsAsString } = require('langchain/util/document')
const { RunnableMap, RunnableLambda, RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { prompts, types } = require('../constants/prompts')
const { generation } = require('../lib/ai')
const { getVectorStore } = require('../lib/vector-store')
//const { getDocumentById } = require('../api/documents')

const buildPrompt = () => {
  const prompt = ChatPromptTemplate.fromTemplate(prompts[types.SYSTEM_PROMPT])

  return prompt
}

const generateResponse1 = async (documentId, userPrompt) => {
  const vectorStore = await getVectorStore()
  const retriever = vectorStore.asRetriever()
  const prompt = buildPrompt(userPrompt)
  const outputParser = new StringOutputParser()

  const document = 'Hi there, I am complaining about fly tipping near my home. Can you advise me?'

  const runnable = RunnableMap.from({
    document: new RunnablePassthrough(),
    context: new RunnablePassthrough(),
    //context: new RunnableLambda({
    //  func: (input) =>
    //    retriever.invoke(input).then((response) => response[0].pageContent),
    //  }).withConfig({ runName: "contextRetriever" }),
    requests: new RunnablePassthrough()
  })

  const chain = runnable
    .pipe(prompt)
    .pipe(generation)
    .pipe(outputParser)
  
  const response = await chain.invoke({
    document: document,
    requests: userPrompt
  })

  console.log(response)

  return response
}

const generateResponse = async (documentId, userPrompt) => {
  try {
    const doc = "Translate 'hello world' into german" //await getDocumentById(documentId)

    // https://js.langchain.com/docs/integrations/vectorstores/pgvector/
    const vectorStore = await getVectorStore()
    const retriever = vectorStore.asRetriever()
    const prompt = buildPrompt(userPrompt)
    const outputParser = new StringOutputParser()

    const llmChain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        document: new RunnablePassthrough()
      },
      prompt,
      generation,
      outputParser
    ])

    const response = await llmChain.invoke(doc)
    console.log(response)

    return response
  }
  catch(e) {
    console.log(e)
    return { response: e }
  }
}

module.exports = {
  generateResponse
}