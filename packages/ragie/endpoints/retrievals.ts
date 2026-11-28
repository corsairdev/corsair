import type { RagieEndpoints } from '..';
import { call } from './call';
import {
	RagieEndpointInputSchemas as Inputs,
	RagieEndpointOutputSchemas as Outputs,
} from './types';

export const retrieve: RagieEndpoints['retrievalsRetrieve'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'retrievals.retrieve',
			input: Inputs.retrievalsRetrieve,
			output: Outputs.retrievalsRetrieve,
		},
		input,
		({
			query,
			top_k,
			filter,
			rerank,
			max_chunks_per_document,
			partition,
			recency_bias,
		}) => ({
			method: 'POST',
			path: '/retrievals',
			// Single-shot search with no side effect, so a 5xx or a dropped
			// connection may be replayed despite the POST method.
			body: {
				query,
				top_k,
				filter,
				rerank,
				max_chunks_per_document,
				partition,
				recency_bias,
			},
		}),
		{
			log: (_parsed, result) => ({ chunks: result.scored_chunks.length }),
		},
	);
