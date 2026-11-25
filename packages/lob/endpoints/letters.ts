import type { LobEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './types';

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
		({
			to,
			from,
			file,
			color,
			extra_service,
			double_sided,
			address_placement,
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
			path: '/letters',
			body: {
				to,
				from,
				file,
				color,
				extra_service,
				double_sided,
				address_placement,
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
