import { OpenAIApi, Configuration } from 'openai';
import { AppNames } from '@/interfaces/AppNames';

// アプリ名やキャッチフレーズを要求するメッセージを生成
const generateMessage = (description: string, lang: string) => {
  let language = "japanese";
  switch(lang) {
    case "ja":
      language = "japanese";
      break;
    case "en":
      language = "english";
      break;
    default:
      language = "japanese";
  }
  return `
    The output should be a markdown code snippet formatted in the following schema in ${language}:

    \`\`\`json
    [
      {
        name: string, // name of the app
        catchphrase: string // catchphrase of the app.
      },
      {
        name: string, // name of the app.
        catchphrase: string // catchphrase of the app.
      },
    ]
    \`\`\`

    NOTES:
    * Please do not include anything other than JSON in your answer.

    I want to create a "${description}" app. Please come up with 5 names for the app.
  `
}

// 文字列を解析し、JSON コンテンツを抽出
const parseGPTResponse = (gptResponse: string): AppNames[] => {
  const regex = /```json([\s\S]*?)```/gm;
  const match = regex.exec(gptResponse);

  if (match === null || match?.[1] === null) {
    throw new Error("JSON content not found in the string");
  }
  const jsonData: AppNames[] = JSON.parse(match[1]);

  return jsonData as AppNames[];
}

export default defineEventHandler(async (event) => {
  const { openaiApiKey } = useRuntimeConfig();
  const { description, lang } = await readBody(event);

  const configuration = new Configuration({
    apiKey: openaiApiKey
  });

  const openai = new OpenAIApi(configuration);

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: 'assistant', content: 'You are a helpful assistant.'},
      {role: 'user', content: generateMessage(description, lang)},
    ],
    temperature: 0.6,
  });

  const messageContent = res.data.choices[0].message?.content;
  if(!messageContent) {
    throw new Error('response does not contain a message content');
  }

  const results = parseGPTResponse(messageContent);
  
  return results;
})
