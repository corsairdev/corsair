import type { RagieEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RagieEndpointInputSchemas as Inputs,
	RagieEndpointOutputSchemas as Outputs,
} from './types';

// deep-search generation bills LLM usage; plan exhaustion answers 402, which
// error-handlers.ts never retries.
export const create: RagieEndpoints['responsesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.create',
			input: Inputs.responsesCreate,
			output: Outputs.responsesCreate,
		},
		input,
		({ input }) => ({
			method: 'POST',
			path: '/responses',
			body: { input },
		}),
	);

export const get: RagieEndpoints['responsesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.get',
			input: Inputs.responsesGet,
			output: Outputs.responsesGet,
		},
		input,
		({ response_id }) => ({
			method: 'GET',
			path: `/responses/${segment(response_id)}`,
		}),
	);
