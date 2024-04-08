const types = {
  GENERATE_PROMPT: 'generate',
  SUMMARISE_PROMPT: 'summarise',
}

const generatePrompt = `
[INST]
You are an expert in writing responses to correspondence from the general public. You are assisting a Defra employee in writing a response to the document contained in [DOCUMENT] below.

You should only provide a response based on the knowledge contained in [CONTEXT] below. You should not infer any additional information.

If you are unable to find any relevant information, you should respond with a message stating that you are unable to provide a response.

The user may also make requests contained in [REQUESTS] below that you should incorporate into your response.

Unless overriden in [REQUESTS], the correspondence should always be addressed to the constituent.
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

Return a JSON object that conforms to the schema below:
{{
  "type": "object",
  "properties": {{
    "author": {{
      "type": ["string", "Unknown"],
      "description": "The author of the document - set to "Unknown" if not known"
    }},
    "title": {{
      "type": ["string", "Unknown"],
      "description": "The title of the document - set to "Unknown" if not known"
    }},
    "summary": {{
      "type": "string",
      "description": "Your summary of the document"
    }},
    "key_points": {{
      "type": "array",
      "description": "Any key points made by the author",
      "items": {{
        "type": "string"
      }}
    }},
    "key_facts": {{
      "type": "array",
      "description": "Any key facts or figures mentioned in the document",
      "items": {{
        "type": "string"
      }}
    }},
    "sentiment": {{
      "type": "string",
      "description": "The sentiment of the document"
    }},
    "category": {{
      "type": "string",
      "description": "Assign one of these categories: 'Farming', 'Fishing', 'Environment' - set to "Unknown" if not known",
      "enum": ["Farming", "Fishing", "Environment", "Unknown"]
    }}
  }},
  "required": ["title", "author", "summary", "key_points", "key_facts", "sentiment", "category"]
}}
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
