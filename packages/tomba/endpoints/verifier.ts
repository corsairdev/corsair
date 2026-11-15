import type { TombaEndpoints } from '..';
import { call } from './call';
import { TombaEndpointInputSchemas, TombaEndpointOutputSchemas } from './types';

export const emailVerifier: TombaEndpoints['verifierEmail'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verifier.email',
			input: TombaEndpointInputSchemas.emailVerifier,
			output: TombaEndpointOutputSchemas.emailVerifier,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'email-verifier',
			query: {
				email: parsed.email,
				enrich_mobile: parsed.enrich_mobile,
				webhook_url: parsed.webhook_url,
			},
		}),
		{
			log: (_parsed, result) => ({
				status: result.data.email.status ?? undefined,
				score: result.data.email.score ?? undefined,
			}),
		},
	);

export const phoneValidator: TombaEndpoints['verifierPhone'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'verifier.phone',
			input: TombaEndpointInputSchemas.phoneValidator,
			output: TombaEndpointOutputSchemas.phoneValidator,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'phone-validator',
			query: {
				phone: parsed.phone,
				country_code: parsed.country_code,
			},
		}),
		{
			log: (_parsed, result) =>
				Array.isArray(result.data)
					? { valid: false }
					: {
							valid: result.data.valid ?? false,
							line_type: result.data.line_type ?? undefined,
						},
		},
	);
