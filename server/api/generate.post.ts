import { OpenAIApi, Configuration } from 'openai';

type AppNames = {
  name: string,
  catchphrase: string,
}

const generateMessage = (description: string) => {
  return `
    The output should be a markdown code snippet formatted in the following schema in Japanese:

    \`\`\`json
    [
      {
        name: string, // name of the app.
        catchphrase: string // catchphrase of the app.
      },
      {
        name: string, // name of the app.
        catchphrase: string // catchphrase of the app.
      },
    ]
    \`\`\`

    NOTES:
    * Do not include app names that do not exist.
    * Please do not include anything other than JSON in your answer.

    「${description}」アプリを作成したいです。アプリ名を5つ考えてください。
  `
}

const parseGPTResponse = (gptResponse: string): AppNames[] => {
  const regex = /```json([\s\S]*?)```/gm
  const match = regex.exec(gptResponse)

  if (match === null || match?.[1] === null) {
    throw new Error("JSON content not found in the string")
  }
  const jsonData: object = JSON.parse(match[1])

  return jsonData as AppNames[]
}

export default defineEventHandler(async (event) => {
  const { openaiApiKey } = useRuntimeConfig();
  const { description } = await readBody(event);

  const configuration = new Configuration({
    apiKey: openaiApiKey
  });

  const openai = new OpenAIApi(configuration);

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: 'assistant', content: 'You are a helpful assistant.'},
      {role: 'user', content: generateMessage(description)},
    ],
    temperature: 0.6,
  });

  if(!res.data.choices[0].message?.content) {
    throw new Error('error');
  }

  const results = parseGPTResponse(res.data.choices[0].message?.content);
  
  return results;
})
