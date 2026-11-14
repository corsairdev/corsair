import type { RocketReachEndpoints } from '..';
import { call, lookupQuery } from './call';
import {
	RocketReachEndpointInputSchemas as Inputs,
	RocketReachEndpointOutputSchemas as Outputs,
} from './types';

export const lookup: RocketReachEndpoints['personLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'person.lookup',
			input: Inputs.personLookup,
			output: Outputs.personLookup,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/person/lookup',
			query: lookupQuery(parsed),
			// A lookup spends a credit and can start an asynchronous enrichment.
			// A retry after a 5xx could charge twice for the same person, and the
			// answer may already be on its way, so it is not replayed.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				profileId: result.id ?? undefined,
				// Anything but complete means the answer is still being built.
				status: result.status ?? undefined,
				emails: result.emails?.length ?? 0,
				phones: result.phones?.length ?? 0,
			}),
		},
	);

/**
 * The bulk route answers with a bare 200 and its request ID in the
 * `RR-Request-ID` header. The client asks `corsair/http` for that header instead
 * of the (empty) body, so the caller has something to poll with.
 */
export const bulkLookup: RocketReachEndpoints['personBulkLookup'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'person.bulkLookup',
			input: Inputs.personBulkLookup,
			output: Outputs.personBulkLookup,
		},
		input,
		({ queries, profile_list, webhook_id }) => ({
			method: 'POST',
			path: '/bulkLookup',
			body: { queries, profile_list, webhook_id },
			responseHeader: 'RR-Request-ID',
			// The batch is accepted once; a replay would look up every person a
			// second time and spend their credits again.
			replayable: false,
		}),
		{
			// unknown: with responseHeader set the body is the header's string, or
			// undefined when RocketReach did not send it.
			shape: (raw) => ({
				requestId: typeof raw === 'string' && raw.length > 0 ? raw : null,
			}),
			log: (parsed, result) => ({
				requested: parsed.queries.length,
				hasRequestId: result.requestId !== null,
			}),
		},
	);

export const checkStatus: RocketReachEndpoints['personCheckStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'person.checkStatus',
			input: Inputs.personCheckStatus,
			output: Outputs.personCheckStatus,
		},
		input,
		({ ids, rr_request_id }) => ({
			method: 'GET',
			path: '/person/checkStatus',
			query: {
				ids: ids?.map((id) => String(id)).join(','),
				rr_request_id,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				profiles: result.length,
				complete: result.filter((profile) => profile.status === 'complete')
					.length,
			}),
		},
	);

export const search: RocketReachEndpoints['personSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'person.search',
			input: Inputs.personSearch,
			output: Outputs.personSearch,
		},
		input,
		({ query, start, page_size, order_by }) => ({
			method: 'POST',
			path: '/person/search',
			body: { query, start, page_size, order_by },
			// A search reads; repeating it returns the same page.
			replayable: true,
		}),
		{
			log: (_, result) => ({ results: result.length }),
		},
	);
