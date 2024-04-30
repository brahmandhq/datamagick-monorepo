export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || "https://api.openai.com";

// import { OPENAI_API_HOST } from "./DevGPT/app/const";

const host = OPENAI_API_HOST;
const key = process.env.OPENAI_API_KEY;
const organization = process.env.OPENAI_ORGANIZATION;

const model = "gpt-3.5-turbo";

export const getCompletions = (
  systemPrompt: string,
  messages: any,
  isGenerateChart: boolean = false
) =>
  fetch(`${host}/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      ...(organization && {
        "OpenAI-Organization": organization,
      }),
    },
    method: "POST",
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      ...(isGenerateChart && {
        response_format: {
          type: "json_object",
        },
      }),
      max_tokens: 1000,
      temperature: 1,
    }),
  });
