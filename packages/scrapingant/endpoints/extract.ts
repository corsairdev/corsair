import type { ScrapingAntEndpoints } from '..';
import { parseJsonObject } from '../client';
import { call } from './call';
import {
	ScrapingAntEndpointInputSchemas as Inputs,
	ScrapingAntEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The AI extractor answers the extracted object itself, one key per requested
 * property, with no envelope and nothing that identifies the request. The
 * credit cost arrives in a header; it is not mixed into the result, because a
 * key added here would be indistinguishable from a property the caller asked
 * the model for.
 */
export const data: ScrapingAntEndpoints['extractData'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'extract.data',
			input: Inputs.extractData,
			output: Outputs.extractData,
		},
		input,
		(parsed) => ({
			url: parsed.url,
			extract_properties: parsed.extract_properties,
			browser: parsed.browser,
			return_page_source: parsed.return_page_source,
			cookies: parsed.cookies,
			js_snippet: parsed.js_snippet,
			proxy_type: parsed.proxy_type,
			proxy_country: parsed.proxy_country,
			wait_for_selector: parsed.wait_for_selector,
			block_resource: parsed.block_resource,
			timeout: parsed.timeout,
		}),
		{
			path: '/v2/extract',
			shape: (raw) => parseJsonObject(raw),
			log: (parsed, result) => ({
				url: parsed.url,
				properties: Object.keys(result).length,
			}),
		},
	);
