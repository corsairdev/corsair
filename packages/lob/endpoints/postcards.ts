import type { LobEndpoints } from '..';
import { segment } from '../client';
import { call, idempotencyHeaders } from './call';
import { omit } from './shared';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './types';

// Sends real, billed mail that cannot be recalled once in production.
export const send: LobEndpoints['postcardsSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.send',
			input: Inputs.postcardsSend,
			output: Outputs.postcardsSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/postcards',
			body: omit(parsed, 'idempotency_key'),
			headers: idempotencyHeaders(parsed.idempotency_key),
		}),
		{
			log: (_, result) => ({
				postcardId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const get: LobEndpoints['postcardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.get',
			input: Inputs.postcardsGet,
			output: Outputs.postcardsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/postcards/${segment(id)}`,
		}),
		{
			log: (_, result) => ({
				postcardId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);
