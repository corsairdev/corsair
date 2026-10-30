import 'dotenv/config';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const apiKey = process.env.LITELLM_API_KEY;
if (!apiKey) {
	throw new Error(
		'Set LITELLM_API_KEY in demo/mastra/.env — see docs/llm-gateway.mdx',
	);
}

// Pinned to Corsair's gateway so the API key can't be pointed at another host.
export const model = createOpenAICompatible({
	name: 'corsair',
	baseURL: 'https://llm.corsair.dev/v1',
	apiKey,
}).chatModel(process.env.LITELLM_MODEL ?? 'gpt-5.4-mini');
