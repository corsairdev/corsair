import 'dotenv/config';
import { OpenAIProvider, Runner } from '@openai/agents';

export const DEFAULT_CHAT_MODEL = 'gpt-5.4-mini';

export function getLlmApiKey(): string {
	const apiKey = process.env.LITELLM_API_KEY ?? process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error(
			'Set LITELLM_API_KEY (or OPENAI_API_KEY) in demo/mcp/.env — see docs/llm-gateway.mdx',
		);
	}
	return apiKey;
}

export function getChatModel(): string {
	return process.env.LITELLM_MODEL ?? DEFAULT_CHAT_MODEL;
}

/** OpenAI Agents runner pointed at the Corsair LiteLLM gateway (Chat Completions API). */
export function createLlmRunner(): Runner {
	const modelProvider = new OpenAIProvider({
		apiKey: getLlmApiKey(),
		baseURL: process.env.LITELLM_BASE_URL ?? 'https://llm.corsair.dev/v1',
		useResponses: false,
	});

	return new Runner({
		modelProvider,
		tracingDisabled: true,
	});
}
