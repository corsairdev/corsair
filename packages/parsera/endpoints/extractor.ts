import type { ParseraEndpoints } from '..';
import { call } from './call';
import {
	ParseraEndpointInputSchemas as Inputs,
	ParseraEndpointOutputSchemas as Outputs,
} from './types';

export const extract: ParseraEndpoints['extractorExtract'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'extractor.extract',
			input: Inputs.extractorExtract,
			output: Outputs.extractorExtract,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/extractor/extract',
			body,
		}),
		{ log: (_, result) => ({ attributes: Object.keys(result).length }) },
	);

export const parse: ParseraEndpoints['extractorParse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'extractor.parse',
			input: Inputs.extractorParse,
			output: Outputs.extractorParse,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/extractor/parse',
			body,
		}),
		{ log: (_, result) => ({ attributes: Object.keys(result).length }) },
	);

export const createScraper: ParseraEndpoints['extractorCreateScraper'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extractor.createScraper',
			input: Inputs.extractorCreateScraper,
			output: Outputs.extractorCreateScraper,
		},
		input,
		() => ({
			method: 'POST',
			path: '/v1/extractor/new',
		}),
		{ log: (_, scraper) => ({ scraperId: scraper.template_id }) },
	);

export const getScraper: ParseraEndpoints['extractorGetScraper'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extractor.getScraper',
			input: Inputs.extractorGetScraper,
			output: Outputs.extractorGetScraper,
		},
		input,
		({ scraperId }) => ({
			method: 'GET',
			path: `/v1/extractor/${encodeURIComponent(scraperId)}`,
		}),
		{ log: (_, scraper) => ({ scraperId: scraper.template_id }) },
	);

export const deleteScraper: ParseraEndpoints['extractorDeleteScraper'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extractor.deleteScraper',
			input: Inputs.extractorDeleteScraper,
			output: Outputs.extractorDeleteScraper,
		},
		input,
		({ scraperId }) => ({
			method: 'DELETE',
			path: `/v1/extractor/${encodeURIComponent(scraperId)}`,
		}),
		{
			// The API answers a message string; validate it arrived rather than
			// fabricating a success from an empty body.
			shape: (raw) => {
				// unknown: raw is the untouched response body; only the message
				// field is expected, anything else is a failure.
				const record = raw as { message?: unknown } | undefined;
				if (
					typeof record?.message !== 'string' ||
					record.message.length === 0
				) {
					throw new Error(
						`Parsera extractor.deleteScraper: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { message: record.message };
			},
			log: (_, result) => ({ message: result.message }),
		},
	);
