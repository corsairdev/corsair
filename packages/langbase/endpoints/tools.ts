import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
import type { WebSearchInput, WebSearchOutput } from './types';
import { LangbaseEndpointInputSchemas, WebSearchOutputSchema } from './types';

export const tools = {
	webSearch: async (
		ctx: LangbasePluginContext,
		input: WebSearchInput,
	): Promise<WebSearchOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['tools.webSearch'].parse(input);
		// unknown because search results contain arbitrary web page snippets and metadata.
		const raw = await makeLangbaseRequest<unknown>(
			'/tools/web-search',
			ctx.key,
			{
				method: 'POST',
				// unknown because request body is a dynamic JSON payload.
				body: parsedInput as Record<string, unknown>,
			},
		);
		return WebSearchOutputSchema.parse(raw);
	},
};
