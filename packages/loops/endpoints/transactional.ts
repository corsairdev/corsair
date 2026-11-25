import type { LoopsEndpoints } from '..';
import { call } from './call';
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
