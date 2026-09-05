import 'dotenv/config';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const apiKey = process.env.LITELLM_API_KEY;
if (!apiKey) {
	throw new Error(
		'Set LITELLM_API_KEY in demo/mastra/.env — see docs/llm-gateway.mdx',
	);
}

// Any model works — this points the demo at Corsair's OpenAI-compatible gateway.
export const model = createOpenAICompatible({
	name: 'corsair',
	baseURL: process.env.LITELLM_BASE_URL ?? 'https://llm.corsair.dev/v1',
	apiKey,
}).chatModel(process.env.LITELLM_MODEL ?? 'gpt-5.4-mini');
