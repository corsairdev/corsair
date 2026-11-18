import { makeLangbaseRequest } from '../client';
import type { WebSearchInput, WebSearchOutput } from './types';
import { WebSearchOutputSchema } from './types';

export const tools = {
	webSearch: async (
		input: WebSearchInput,
		apiKey?: string,
	): Promise<WebSearchOutput> => {
		const raw = await makeLangbaseRequest<unknown>(
			'/tools/web-search',
			apiKey,
			{
				method: 'POST',
				body: input as Record<string, unknown>,
			},
		);
		return WebSearchOutputSchema.parse(raw);
	},
};
