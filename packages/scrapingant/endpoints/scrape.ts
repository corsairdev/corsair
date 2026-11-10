import type { ScrapingAntEndpoints } from '..';
import type { ScrapingAntQuery } from '../client';
import { parseJsonObject } from '../client';
import { call } from './call';
import {
	ScrapingAntEndpointInputSchemas as Inputs,
	ScrapingAntEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The options every scraping route shares, under the provider's own names. An
 * unset option is dropped rather than sent as `undefined`: `corsair/http` and
 * `URLSearchParams` both skip undefined, but the omission is explicit here so
 * the provider's defaults apply rather than being overwritten with an empty
 * string.
 */
function scrapeQuery(input: {
	url: string;
	browser?: boolean;
	return_page_source?: boolean;
	cookies?: string;
	js_snippet?: string;
	proxy_type?: 'datacenter' | 'residential';
	proxy_country?: string;
	wait_for_selector?: string;
	block_resource?: readonly string[];
	timeout?: number;
}): ScrapingAntQuery {
	return {
		url: input.url,
		browser: input.browser,
		return_page_source: input.return_page_source,
		cookies: input.cookies,
		js_snippet: input.js_snippet,
		proxy_type: input.proxy_type,
		proxy_country: input.proxy_country,
		wait_for_selector: input.wait_for_selector,
		block_resource: input.block_resource,
		timeout: input.timeout,
	};
}

/**
 * The HTML route answers the page itself, not an envelope, and its
 * `Content-Type` is `application/json` in the provider's spec even though the
 * body is HTML, so the body is taken as text and only checked for being there.
 */
export const html: ScrapingAntEndpoints['scrapeHtml'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.html',
			input: Inputs.scrapeHtml,
			output: Outputs.scrapeHtml,
		},
		input,
		scrapeQuery,
		{
			path: '/v2/general',
			shape: (raw) => ({
				html: raw.body,
				page_status: raw.pageStatus,
				credits_cost: raw.creditsCost,
			}),
			log: (parsed) => ({ url: parsed.url }),
		},
	);

export const markdown: ScrapingAntEndpoints['scrapeMarkdown'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.markdown',
			input: Inputs.scrapeMarkdown,
			output: Outputs.scrapeMarkdown,
		},
		input,
		scrapeQuery,
		{
			path: '/v2/markdown',
			shape: (raw) => {
				const body = parseJsonObject(raw);
				return {
					url: body.url,
					markdown: body.markdown,
					credits_cost: raw.creditsCost,
				};
			},
			log: (parsed, result) => ({
				url: parsed.url,
				markdownLength: result.markdown.length,
			}),
		},
	);

export const extended: ScrapingAntEndpoints['scrapeExtended'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.extended',
			input: Inputs.scrapeExtended,
			output: Outputs.scrapeExtended,
		},
		input,
		scrapeQuery,
		{
			path: '/v2/extended',
			shape: (raw) => {
				const body = parseJsonObject(raw);
				return { ...body, credits_cost: raw.creditsCost };
			},
			log: (parsed, result) => ({
				url: parsed.url,
				pageStatus: result.status_code,
			}),
		},
	);
