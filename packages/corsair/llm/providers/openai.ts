import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  }
  return openaiClient;
}

export const openai = async <T>({
  prompt,
  schema,
  message,
}: {
  prompt: string;
  schema: z.ZodSchema<T>;
  message: string;
}): Promise<T | null> => {
  try {
    const client = getOpenAIClient();
    const response = await client.responses.parse({
      model: "gpt-4.1",
      input: [
        { role: "system", content: prompt },
        { role: "user", content: message || "" },
      ],
      text: {
        format: zodTextFormat(schema, "Response"),
      },
    });

    const parsedResponse = response.output_parsed;

    console.log("parsedResponse");
    console.log(JSON.stringify(parsedResponse, null, 2));

    return parsedResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};
