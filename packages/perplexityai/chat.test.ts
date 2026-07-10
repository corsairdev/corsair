import * as Chat from './endpoints/chat';
import { PerplexityAiEndpointInputSchemas } from './endpoints/types';

describe('Perplexity AI Chat Completions', () => {
	it('should export the chat endpoint', () => {
		expect(Chat).toBeDefined();
		expect(Chat.completions).toBeDefined();
	});

	it('should validate schemas correctly', () => {
		const input = {
			model: 'llama-3.1-sonar-small-128k-online',
			messages: [{ role: 'user', content: 'Hello' }],
		};
		const parsed =
			PerplexityAiEndpointInputSchemas.chatCompletions.safeParse(input);
		expect(parsed.success).toBe(true);
	});

	it('should reject when both presence_penalty and frequency_penalty are provided', () => {
		const input = {
			model: 'llama-3.1-sonar-small-128k-online',
			messages: [{ role: 'user', content: 'Hello' }],
			presence_penalty: 0.5,
			frequency_penalty: 0.5,
		};
		const parsed =
			PerplexityAiEndpointInputSchemas.chatCompletions.safeParse(input);
		expect(parsed.success).toBe(false);
	});
});
