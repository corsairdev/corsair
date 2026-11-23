import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Starts the ranking-competitors lookup. Moz answers at once with an
 * async_call receipt; follow it with jobs.lookup until the status is
 * complete. The work spends quota from the mozscape bucket, so this request
 * is never replayed after a failure.
 */
export const fetchCompetitors: MozEndpoints['competitorsFetch'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'competitors.fetch',
			input: Inputs.competitorsFetch,
			output: Outputs.competitorsFetch,
		},
		input,
		(parsed) => ({
			method: 'data.site.competitor.fetch',
			data: parsed,
			// A lost response after acceptance means the work already ran and
			// charged quota; re-sending would charge it a second time.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				query: parsed.target_query.query,
				callId: result.async_call.id,
				status: result.async_call.status,
			}),
		},
	);
