import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';

const apiKey = process.env.LITELLM_API_KEY;
if (!apiKey) {
	throw new Error(
		'Set LITELLM_API_KEY in demo/langchain/.env — see docs/llm-gateway.mdx',
	);
}

// Pinned to Corsair's gateway so the API key can't be pointed at another host.
export const llm = new ChatOpenAI({
	model: process.env.LITELLM_MODEL ?? 'gpt-5.4-mini',
	configuration: {
		baseURL: 'https://llm.corsair.dev/v1',
		apiKey,
	},
	apiKey,
});
