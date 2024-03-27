const Joi = require('joi')
const { ChatOpenAI, OpenAIEmbeddings } = require('@langchain/openai')
const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { CheerioWebBaseLoader } = require('langchain/document_loaders/web/cheerio')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { formatDocumentsAsString } = require('langchain/util/document')
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector')
const { RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables')
const { StringOutputParser } = require('@langchain/core/output_parsers')
const { getConfig } = require('../config/db')


const config = await getConfig()


/*
const chatModel = new ChatOpenAI({
    openAIApiKey: '...'
})

const url = "https://langchain.com"
const loader = new CheerioWebBaseLoader(url)
const docs = await loader.load()

const textSplitter = new RecursiveCharacterTextSplitter()
const allSplits = await textSplitter.splitDocuments(docs)

const embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-large" })

const vectorStore = await QdrantVectorStore.fromDocuments(
  allSplits,
  embeddings,
  {
    url: "http://localhost:6333",
    collectionName: "a_test_collection"
  }
)

const retriever = vectorStore.asRetriever()

const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the question based only on the following context:
  {context}

  Question: {question}

  write 1 short paragraph and include 2 references in your output`
)

const outputParser = new StringOutputParser()

const llmChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough()
  },
  prompt,
  chatModel,
  outputParser
])

const response = await llmChain.invoke("What is langchain?")

console.log(response)
*/








module.exports = {
  method: 'POST',
  path: '/',
  options: {
    validate: {
      payload: Joi.object({
        prompt: Joi.string().required(),
        persona: Joi.string().required(),
        context: Joi.string().required(),
        document: Joi.string().required()
      })
    },
    //auth: { scope: [admin] },
    handler: async (request, h) => {
    try {
      const chatModel = new ChatOpenAI({
        //openAIApiKey: "..."
      })

      //const response = await chatModel.invoke('Translate "Hello World" into German.')

      // https://js.langchain.com/docs/integrations/vectorstores/pgvector/

      const pgvectorStore = new PGVectorStore(
        new OpenAIEmbeddings(),
        config
      )



      const retriever = pgvectorStore.asRetriever()

      const prompt = ChatPromptTemplate.fromTemplate(
        `Answer the question based only on the following context:
        {context}
      
        Question: {question}
      
        write 1 short paragraph and include 2 references in your output`
      )
      
      const outputParser = new StringOutputParser()
      
      const llmChain = RunnableSequence.from([
        {
          context: retriever.pipe(formatDocumentsAsString),
          question: new RunnablePassthrough()
        },
        prompt,
        chatModel,
        outputParser
      ])

      const response = await llmChain.invoke("What is langchain?")

      return { response: response }
    }
    catch(e) {
      return { response: e }
    }



      return h.view('index')
    }
  }
}
