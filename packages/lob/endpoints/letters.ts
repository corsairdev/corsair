import type { LobEndpoints } from '..';
import { segment } from '../client';
import { call, idempotencyHeaders } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './registry';
import { omit } from './shared';

// Sends real, billed mail that cannot be recalled once in production.
export const send: LobEndpoints['lettersSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.send',
			input: Inputs.lettersSend,
			output: Outputs.lettersSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/letters',
			body: omit(parsed, 'idempotency_key', 'lob_version'),
			headers: idempotencyHeaders(parsed.idempotency_key, {
				'Lob-Version': parsed.lob_version,
			}),
		}),
		{
			log: (_, result) => ({
				letterId: result.id ?? undefined,
				extraService: result.extra_service ?? undefined,
			}),
		},
	);

export const get: LobEndpoints['lettersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.get',
			input: Inputs.lettersGet,
			output: Outputs.lettersGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/letters/${segment(id)}`,
		}),
		{
			log: (_, result) => ({
				letterId: result.id ?? undefined,
				trackingNumber: result.tracking_number ?? undefined,
			}),
		},
	);
