import { CloudflareBrowserRenderingClient } from '../client';
import type { CloudflareBrowserRenderingContext } from '../index';
import type {
	ScrapeHtmlElementsCreateInput,
	ScrapeHtmlElementsCreateResponse,
} from './types';

export const ScrapeHtmlElements = {
	create: async (
		ctx: CloudflareBrowserRenderingContext,
		input: ScrapeHtmlElementsCreateInput,
	): Promise<ScrapeHtmlElementsCreateResponse> => {
		const client = new CloudflareBrowserRenderingClient(ctx);
		return client.scrapeHtmlElements(
			input.accountId,
			input.url,
			input.selectors,
		);
	},
};
