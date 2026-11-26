import type { LobEndpoints } from '..';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './types';

export const verify: LobEndpoints['intlVerificationsVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'intlVerifications.verify',
			input: Inputs.intlVerificationsVerify,
			output: Outputs.intlVerificationsVerify,
		},
		input,
		({
			address,
			recipient,
			primary_line,
			secondary_line,
			city,
			state,
			postal_code,
			country,
		}) => ({
			method: 'POST',
			path: '/intl_verifications',
			body: {
				address,
				recipient,
				primary_line,
				secondary_line,
				city,
				state,
				postal_code,
				country,
			},
		}),
		{
			log: (_, result) => ({
				deliverability: result.deliverability ?? undefined,
				country: result.country ?? undefined,
			}),
		},
	);
