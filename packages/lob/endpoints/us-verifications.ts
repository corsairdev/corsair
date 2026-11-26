import type { LobEndpoints } from '..';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './registry';

// Verifications are synchronous POSTs that read nothing back from Lob, but
// they spend verifications on the account's plan, so the log keeps only the
// outcome, never the address.

export const verify: LobEndpoints['usVerificationsVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usVerifications.verify',
			input: Inputs.usVerificationsVerify,
			output: Outputs.usVerificationsVerify,
		},
		input,
		({
			address,
			primary_line,
			secondary_line,
			urbanization,
			recipient,
			city,
			state,
			zip_code,
			case: casing,
		}) => ({
			method: 'POST',
			path: '/us_verifications',
			body: {
				address,
				primary_line,
				secondary_line,
				urbanization,
				recipient,
				city,
				state,
				zip_code,
			},
			query: { case: casing },
		}),
		{
			log: (_, result) => ({
				deliverability: result.deliverability ?? undefined,
				valid: result.valid_address ?? undefined,
			}),
		},
	);

export const bulk: LobEndpoints['usVerificationsBulk'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usVerifications.bulk',
			input: Inputs.usVerificationsBulk,
			output: Outputs.usVerificationsBulk,
		},
		input,
		({ addresses, case: casing }) => ({
			method: 'POST',
			path: '/bulk/us_verifications',
			body: { addresses },
			query: { case: casing },
		}),
		{
			log: (_, result) => ({
				rows: result.addresses.length,
				errors: result.errors ?? undefined,
			}),
		},
	);
