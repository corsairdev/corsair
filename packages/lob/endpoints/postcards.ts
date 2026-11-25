import type { LobEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
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
		({
			to,
			from,
			front,
			back,
			size,
			use_type,
			mail_type,
			merge_variables,
			send_date,
			description,
			metadata,
			idempotency_key,
		}) => ({
			method: 'POST',
			path: '/postcards',
			body: {
				to,
				from,
				front,
				back,
				size,
				use_type,
				mail_type,
				merge_variables,
				send_date,
				description,
				metadata,
			},
			headers: idempotency_key
				? { 'Idempotency-Key': idempotency_key }
				: undefined,
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
