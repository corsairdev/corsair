import type { JigsawstackEndpoints } from '../index';
import { jigsawCall, returnTypeOptions } from './call';

export const scrape: JigsawstackEndpoints['scrape'] = async (ctx, input) =>
	jigsawCall(ctx, 'jigsawstack.web.scrape', '/v1/ai/scrape', 'POST', input, {
		body: input,
	});

export const htmlToAny: JigsawstackEndpoints['htmlToAny'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.web.htmlToAny',
		'/v1/web/html_to_any',
		'POST',
		input,
		returnTypeOptions(input),
	);

export const search: JigsawstackEndpoints['search'] = async (ctx, input) =>
	jigsawCall(ctx, 'jigsawstack.web.search', '/v1/web/search', 'POST', input, {
		body: input,
	});

export const searchSuggestions: JigsawstackEndpoints['searchSuggestions'] =
	async (ctx, input) =>
		jigsawCall(
			ctx,
			'jigsawstack.web.searchSuggestions',
			'/v1/web/search/suggest',
			'GET',
			input,
			{ query: { query: input.query } },
		);
