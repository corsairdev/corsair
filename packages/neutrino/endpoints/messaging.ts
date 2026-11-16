import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Generates a security code and texts it to the number. It sends a real SMS, so
 * it is a write with a cost, and the code it returns is the same one the
 * recipient receives: a caller compares it with `verifySecurityCode`.
 */
export const smsVerify: NeutrinoEndpoints['smsVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messaging.smsVerify',
			input: Inputs.smsVerify,
			output: Outputs.smsVerify,
		},
		input,
		({ number, codeLength, countryCode, languageCode, brandName }) => ({
			method: 'GET',
			path: '/sms-verify',
			// A success sends a real SMS, so a 5xx must not be replayed.
			sendsMessage: true,
			query: {
				number,
				'code-length': codeLength,
				'country-code': countryCode,
				'language-code': languageCode,
				'brand-name': brandName,
			},
		}),
		{
			log: (_, result) => ({
				sent: result.sent ?? undefined,
				numberValid: result['number-valid'] ?? undefined,
			}),
		},
	);
