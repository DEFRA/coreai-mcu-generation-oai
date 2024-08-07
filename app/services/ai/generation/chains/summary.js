const { openAi } = require('../../../../config/ai').azure
const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { RunnableSequence } = require('@langchain/core/runnables')
const { JsonOutputParser } = require('@langchain/core/output_parsers')
const { prompts, types } = require('../../../../constants/prompts')
const { getClient } = require('../../clients')

const buildSummaryChain = () => {
  const prompt = ChatPromptTemplate.fromTemplate(prompts[types.SUMMARISE_PROMPT])

  const chain = RunnableSequence.from([
    {
      document: (input) => input.document
    },
    prompt,
    getClient(`azure|openai|${openAi.generationModelName}`),
    new JsonOutputParser()
  ])

  return chain
}

module.exports = {
  buildSummaryChain
}
