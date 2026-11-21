import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const create: StannpEndpoints['smsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sms.create',
			input: Inputs.smsCreate,
			output: Outputs.smsCreate,
		},
		input,
		(
			{ test, phone_number, recipient_id, message, country, idempotencyKey },
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/sms/create',
			form: { test, phone_number, recipient_id, message, country },
			idempotencyKey,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				status: result.status ?? undefined,
				cost: result.cost ?? undefined,
			}),
		},
	);
