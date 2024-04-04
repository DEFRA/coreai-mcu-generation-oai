const types = {
  GENERATE_PROMPT: 'generate',
  SUMMARISE_PROMPT: 'summarise',
}

const generatePrompt = `
[INST]
You are an expert in writing responses to correspondence from ministers and the general public. You are assisting a Defra employee in writing a response to the document contained in [DOCUMENT] below.

You should only provide a response based on the knowledge contained in [CONTEXT] below. You should not infer any additional information.

If you are unable to find any relevant information, you should respond with a message stating that you are unable to provide a response.

The user may also make requests contained in [REQUESTS] below that you should incorporate into your response.
[/INST]

[DOCUMENT]
{document}
[/DOCUMENT]

[CONTEXT]
{context}
[/CONTEXT]

[REQUESTS]
{requests}
[/REQUESTS]
`

const summarisePrompt = `
[INST]
You are an expert in summarising written documents. You should summarise the text contained in [TEXT] below.

Do not infer anything about the document that is not explicitly stated.

Return a JSON object containing:
  - author: [The author of the document - set to null if not known],
  - title: [The title of the document - set to null if not known],
  - summary: [Your summary of the document],
  - key_points: [Any key points made by the author],
  - key_facts: [Any key facts or figures mentioned in the document],
  - sentiment: [The sentiment of the document]
  - category: [Assign one of these categories: 'Farming', 'Fishing', 'Environment' - set to 'Unknown' if not known]
[/INST]

[TEXT]
{document}
[/TEXT]
`

const prompts = {
  [types.GENERATE_PROMPT]: generatePrompt,
  [types.SUMMARISE_PROMPT]: summarisePrompt,
}

module.exports = {
  types,
  prompts
}
