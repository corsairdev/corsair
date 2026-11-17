import type { NeuronwriterEndpoints } from '..';
import { call } from './call';
import {
	NeuronwriterEndpointInputSchemas as Inputs,
	NeuronwriterEndpointOutputSchemas as Outputs,
} from './types';

/** Reads the last saved revision of a query's content. */
export const get: NeuronwriterEndpoints['contentGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'content.get',
			input: Inputs.contentGet,
			output: Outputs.contentGet,
		},
		input,
		(body) => ({ method: 'get-content', body }),
		{
			log: ({ query }, result) => ({
				query,
				type: result.type ?? undefined,
				length: result.content?.length ?? undefined,
			}),
		},
	);

/**
 * Replaces the editor content and saves it as a new revision. The provider
 * accepts either `html` or a `url` to fetch, never both.
 */
export const importContent: NeuronwriterEndpoints['contentImport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'content.import',
			input: Inputs.contentImport,
			output: Outputs.contentImport,
		},
		input,
		(body) => ({ method: 'import-content', body }),
		{
			// The URL is caller-supplied and a private draft link can carry a
			// preview token or signed query, so only the query id is logged.
			log: ({ query }) => ({ query }),
		},
	);

/**
 * Scores the content without saving anything. This is the call to use when the
 * score matters and the revision does not.
 */
export const evaluate: NeuronwriterEndpoints['contentEvaluate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'content.evaluate',
			input: Inputs.contentEvaluate,
			output: Outputs.contentEvaluate,
		},
		input,
		(body) => ({ method: 'evaluate-content', body }),
		{
			// The URL is caller-supplied and a private draft link can carry a
			// preview token or signed query, so only the query id is logged.
			log: ({ query }) => ({ query }),
		},
	);
