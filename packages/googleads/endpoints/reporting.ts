import type { GoogleAdsEndpoints } from '..';
import { customerPathId } from '../client';
import { call, rowCount } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `googleAds:search` takes the query in the body and pages at 10,000 rows. It
 * is a POST because the query does not fit a URL safely, not because it writes.
 */
export const search: GoogleAdsEndpoints['search'] = async (ctx, rawInput) =>
	call(
		ctx,
		{ event: 'search', input: Inputs.search, output: Outputs.search },
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/customers/${customerPathId(input.customerId)}/googleAds:search`,
			body: {
				query: input.query,
				...(input.pageSize === undefined || input.pageSize === null
					? {}
					: { pageSize: input.pageSize }),
				...(input.pageToken ? { pageToken: input.pageToken } : {}),
				...(input.validateOnly ? { validateOnly: true } : {}),
			},
		}),
		{ log: (result) => rowCount(result.results) },
	);

/**
 * `googleAds:searchStream` returns the whole result set in one response, as a
 * JSON array of response objects.
 */
export const searchStream: GoogleAdsEndpoints['searchStream'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'searchStream',
			input: Inputs.searchStream,
			output: Outputs.searchStream,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/customers/${customerPathId(input.customerId)}/googleAds:searchStream`,
			body: {
				query: input.query,
				...(input.validateOnly ? { validateOnly: true } : {}),
			},
		}),
		{
			// The array is flattened here, before the output schema parses it, so
			// the schema and the documented shape stay one object.
			shape: (raw) => {
				// unknown: the stream body is an untyped JSON array.
				const chunks = Array.isArray(raw) ? raw : [raw];
				// unknown: a row has no static shape; the output schema checks it.
				const results: unknown[] = [];
				let fieldMask: string | undefined;
				let queryResourceConsumption: string | undefined;
				for (const chunk of chunks) {
					if (chunk === null || typeof chunk !== 'object') continue;
					// unknown: one chunk's members until each is checked below.
					const part = chunk as {
						results?: unknown; // unknown: checked with Array.isArray.
						fieldMask?: unknown; // unknown: checked with typeof.
						queryResourceConsumption?: unknown; // unknown: checked with typeof.
					};
					if (Array.isArray(part.results)) results.push(...part.results);
					if (typeof part.fieldMask === 'string') {
						fieldMask ??= part.fieldMask;
					}
					if (typeof part.queryResourceConsumption === 'string') {
						queryResourceConsumption ??= part.queryResourceConsumption;
					}
				}
				return { results, fieldMask, queryResourceConsumption };
			},
			log: (result) => rowCount(result.results),
		},
	);

/**
 * `googleAds:mutate` mutates several kinds of entity in one call. A caller
 * wanting a single entity uses the typed operations below, which send the same
 * request with one operation.
 */
export const mutate: GoogleAdsEndpoints['mutate'] = async (ctx, rawInput) =>
	call(
		ctx,
		{ event: 'mutate', input: Inputs.mutate, output: Outputs.mutate },
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/customers/${customerPathId(input.customerId)}/googleAds:mutate`,
			body: {
				mutateOperations: input.mutateOperations,
				...(input.partialFailure ? { partialFailure: true } : {}),
				...(input.validateOnly ? { validateOnly: true } : {}),
				...(input.responseContentType
					? { responseContentType: input.responseContentType }
					: {}),
			},
		}),
		{ log: (result) => ({ operations: result.results?.length ?? 0 }) },
	);
