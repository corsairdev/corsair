import type { NeuronwriterEndpoints } from '..';
import { call } from './call';
import {
	NeuronwriterEndpointInputSchemas as Inputs,
	NeuronwriterEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Queues an analysis. It costs one Content Writer analysis against the
 * account's monthly limit, and the recommendations are not ready when this
 * returns: poll analysis.get until `status` is `ready`, usually after about a
 * minute.
 */
export const start: NeuronwriterEndpoints['analysisStart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analysis.start',
			input: Inputs.analysisStart,
			output: Outputs.analysisStart,
		},
		input,
		(body) => ({ method: 'new-query', body }),
		{
			log: (_, result) => ({ query: result.query }),
		},
	);

/**
 * Polls one analysis. It answers `{ status }` alone while the analysis is
 * running, and the recommendations only once `status` is `ready`, so the
 * response carries all of them as optional.
 */
export const get: NeuronwriterEndpoints['analysisGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analysis.get',
			input: Inputs.analysisGet,
			output: Outputs.analysisGet,
		},
		input,
		({ query }) => ({ method: 'get-query', body: { query } }),
		{
			log: ({ query }, result) => ({
				query,
				status: result.status,
				competitors: result.competitors?.length ?? undefined,
			}),
		},
	);
