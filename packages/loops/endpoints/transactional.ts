import type { LoopsEndpoints } from '..';
import { call } from './call';
import {
	ContentEndpointInputSchemas as ContentInputs,
	ContentEndpointOutputSchemas as ContentOutputs,
} from './content-types';
import {
	LoopsEndpointInputSchemas as Inputs,
	LoopsEndpointOutputSchemas as Outputs,
} from './types';

export const send: LoopsEndpoints['transactionalSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactional.send',
			input: Inputs.transactionalSend,
			output: Outputs.transactionalSend,
		},
		input,
		({ idempotencyKey, ...body }) => ({
			method: 'POST',
			path: '/v1/transactional',
			body,
			idempotencyKey,
		}),
		{
			log: (parsed, result) => ({
				transactionalId: parsed.transactionalId,
				queued: result.success,
			}),
		},
	);

export const list: LoopsEndpoints['transactionalList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactional.list',
			input: ContentInputs.transactionalList,
			output: ContentOutputs.transactionalList,
		},
		input,
		({ perPage, cursor }) => ({
			method: 'GET',
			path: '/v1/transactional',
			query: { perPage, cursor },
		}),
	);
