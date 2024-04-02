const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { prompts, types } = require('../constants/prompts')
const { generation } = require('../lib/ai')
const { getVectorStore } = require('../lib/vector-store')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { RunnableMap, RunnableLambda, RunnablePassthrough } = require('@langchain/core/runnables')

const buildPrompt = () => {
  const prompt = ChatPromptTemplate.fromTemplate(prompts[types.SYSTEM_PROMPT])

  return prompt
}

const generateResponse = async (documentId, userPrompt) => {
  const retriever = (await getVectorStore()).asRetriever()

  const prompt = buildPrompt(userPrompt)

  const outputParser = new StringOutputParser()

  const document = 'Hi there, I am complaining about fly tipping near my home. Can you advise me?'

  const runnable = RunnableMap.from({
    document: new RunnablePassthrough(),
    // context: new RunnablePassthrough(),
    // // context: new RunnableLambda({
    // //   func: (input) =>
    // //     retriever.invoke(input).then((response) => response[0].pageContent),
    // //   }).withConfig({ runName: "contextRetriever" }),
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

module.exports = {
  generateResponse
}