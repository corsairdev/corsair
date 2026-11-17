import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Generates a security code and texts it to the number. It sends a real SMS, so
 * it needs approval, and Neutrino keeps the code it sent: a caller checks what
 * the person types with `verifySecurityCode`.
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

/**
 * Places an automated call that reads a security code out to the number. Like
 * smsVerify it reaches a real person and costs credits.
 */
export const phoneVerify: NeutrinoEndpoints['phoneVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messaging.phoneVerify',
			input: Inputs.phoneVerify,
			output: Outputs.phoneVerify,
		},
		input,
		({ number, codeLength, playbackDelay, countryCode, languageCode }) => ({
			method: 'GET',
			path: '/phone-verify',
			query: {
				number,
				'code-length': codeLength,
				'playback-delay': playbackDelay,
				'country-code': countryCode,
				'language-code': languageCode,
			},
		}),
		{
			log: (_, result) => ({
				calling: result.calling ?? undefined,
				numberValid: result['number-valid'] ?? undefined,
			}),
		},
	);

/**
 * Checks a code the person typed against the codes smsVerify and phoneVerify
 * sent from this account. Neutrino keeps each code for a limited time, so an
 * old code answers `verified: false`.
 */
export const verifySecurityCode: NeutrinoEndpoints['verifySecurityCode'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messaging.verifySecurityCode',
			input: Inputs.verifySecurityCode,
			output: Outputs.verifySecurityCode,
		},
		input,
		({ securityCode, limitBy }) => ({
			method: 'GET',
			path: '/verify-security-code',
			query: { 'security-code': securityCode, 'limit-by': limitBy },
		}),
		{
			// The code itself is a secret, so only the answer is logged.
			log: (_, result) => ({ verified: result.verified ?? undefined }),
		},
	);
