import type { MoceanEndpoints } from '..';
import { moceanForm } from '../client';
import { call } from './call';
import {
	MoceanEndpointInputSchemas as Inputs,
	MoceanEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Sends a verification code over SMS. Destructive: it sends a message and
 * charges the account per attempt. Keep the returned `reqid`; verify.check
 * and verify.resend need it.
 */
export const request: MoceanEndpoints['verifyRequest'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'verify.request',
			input: Inputs.verifyRequest,
			output: Outputs.verifyRequest,
		},
		input,
		(parsed) => ({
			family: 'verify',
			// A lost answer may still have sent a charged code.
			replayable: false,
			method: 'POST',
			path: '/verify/req/sms',
			body: moceanForm({
				'mocean-to': parsed.mocean_to,
				'mocean-brand': parsed.mocean_brand,
				'mocean-from': parsed.mocean_from,
				'mocean-code-length': parsed.mocean_code_length,
				'mocean-pin-validity': parsed.mocean_pin_validity,
			}),
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			log: (_, result) => ({ reqid: result.reqid ?? undefined }),
		},
	);

/** Resends the code of an existing verify request, charging per attempt. */
export const resend: MoceanEndpoints['verifyResend'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'verify.resend',
			input: Inputs.verifyResend,
			output: Outputs.verifyResend,
		},
		input,
		({ mocean_reqid }) => ({
			family: 'verify',
			replayable: false,
			method: 'POST',
			path: '/verify/resend/sms',
			body: moceanForm({ 'mocean-reqid': mocean_reqid }),
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			log: ({ mocean_reqid }) => ({ reqid: mocean_reqid }),
		},
	);

/** Checks the PIN a user gave you against an existing verify request. */
export const check: MoceanEndpoints['verifyCheck'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'verify.check',
			input: Inputs.verifyCheck,
			output: Outputs.verifyCheck,
		},
		input,
		({ mocean_reqid, mocean_code }) => ({
			family: 'verify',
			replayable: false,
			method: 'POST',
			path: '/verify/check',
			body: moceanForm({
				'mocean-reqid': mocean_reqid,
				'mocean-code': mocean_code,
			}),
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			log: ({ mocean_reqid }) => ({ reqid: mocean_reqid }),
		},
	);
