import { asRecord } from 'corsair/core';
import type { NewrelicEndpoints } from '..';
import { call } from './call';
import {
	NewrelicEndpointInputSchemas as Inputs,
	NEWRELIC_NRQL_DOCUMENT,
	NewrelicEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Runs a NRQL query through NerdGraph. The GraphQL answer nests the result at
 * `data.actor.account.nrql`, and a bad query comes back as a 200 with an
 * `errors` array, which the client turns into a thrown error.
 *
 * NerdGraph posts its query document as the body, so the account id and the
 * statement travel as variables.
 */
export const nrql: NewrelicEndpoints['queryNrql'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'query.nrql',
			input: Inputs.queryNrql,
			output: Outputs.queryNrql,
		},
		input,
		({ accountId, query }) => ({
			method: 'POST',
			graphql: {
				query: NEWRELIC_NRQL_DOCUMENT,
				variables: { accountId, query },
			},
		}),
		{
			shape: (raw) => {
				const data = asRecord(asRecord(raw)?.data);
				const actor = asRecord(data?.actor);
				const account = asRecord(actor?.account);
				const nrql = asRecord(account?.nrql);
				if (!nrql) {
					throw new Error(
						`Expected a NerdGraph NRQL result, got ${typeof raw}`,
					);
				}
				const results = nrql.results;
				if (!Array.isArray(results)) {
					throw new Error('NerdGraph NRQL result has no results array');
				}
				return { results, metadata: nrql.metadata };
			},
			log: ({ accountId }, result) => ({
				accountId,
				rows: result.results.length,
			}),
		},
	);
