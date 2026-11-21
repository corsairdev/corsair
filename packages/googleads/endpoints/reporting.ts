import type { GoogleAdsEndpoints } from '..';
import { customerPathId } from '../client';
import { call, rowCount } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
	SearchStreamChunksSchema,
} from './types';

/**
 * A failure Google reported inside a `searchStream` body after the stream had
 * started. It carries the canonical code and status only; the message can echo
 * the query, so it stays out.
 */
export class GoogleAdsStreamError extends Error {
	readonly code: number | undefined;
	readonly status: string | undefined;

	constructor(code: number | undefined, status: string | undefined) {
		super(
			`Google Ads searchStream failed partway${status ? `: ${status}` : ''}`,
		);
		this.name = 'GoogleAdsStreamError';
		this.code = code;
		this.status = status;
	}
}

/**
 * `googleAds:search` takes the query in the body and pages at a fixed 10,000
 * rows (v17 removed `pageSize`). It is a POST because the query does not fit a
 * URL safely, not because it writes.
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
			body: { query: input.query },
		}),
		{
			// Each chunk is validated before the array is flattened, so a
			// malformed chunk fails the call instead of reading as zero rows.
			shape: (raw) => {
				const chunks = SearchStreamChunksSchema.parse(raw);
				const results: Record<string, unknown>[] = []; // unknown: row fields per query.
				let fieldMask: string | undefined;
				let requestId: string | undefined;
				let queryResourceConsumption: string | undefined;
				for (const chunk of chunks) {
					if (chunk.error) {
						throw new GoogleAdsStreamError(
							chunk.error.code ?? undefined,
							chunk.error.status ?? undefined,
						);
					}
					if (chunk.results) results.push(...chunk.results);
					fieldMask ??= chunk.fieldMask ?? undefined;
					requestId ??= chunk.requestId ?? undefined;
					queryResourceConsumption ??=
						chunk.queryResourceConsumption ?? undefined;
				}
				return { results, fieldMask, requestId, queryResourceConsumption };
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
		{
			log: (result) => ({
				operations: result.mutateOperationResponses?.length ?? 0,
			}),
		},
	);
