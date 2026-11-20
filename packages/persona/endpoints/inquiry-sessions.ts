import type { PersonaEndpoints } from '..';
import { attributesBody, call } from './call';
import {
	PersonaEndpointInputSchemas as Inputs,
	PersonaEndpointOutputSchemas as Outputs,
} from './types';

export const create: PersonaEndpoints['inquirySessionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquirySessions.create',
			input: Inputs.inquirySessionsCreate,
			output: Outputs.inquirySessionsCreate,
		},
		input,
		() => ({
			method: 'POST',
			path: '/inquiry-sessions',
			// The session RPC takes an empty data object.
			body: attributesBody({}),
		}),
		{ log: (_, result) => ({ sessionId: result.data?.id ?? undefined }) },
	);

export const get: PersonaEndpoints['inquirySessionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquirySessions.get',
			input: Inputs.inquirySessionsGet,
			output: Outputs.inquirySessionsGet,
		},
		input,
		({ inquirySessionId }) => ({
			method: 'GET',
			path: `/inquiry-sessions/${encodeURIComponent(inquirySessionId)}`,
		}),
		{ log: (_, result) => ({ sessionId: result.data?.id ?? undefined }) },
	);

export const expire: PersonaEndpoints['inquirySessionsExpire'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquirySessions.expire',
			input: Inputs.inquirySessionsExpire,
			output: Outputs.inquirySessionsExpire,
		},
		input,
		({ inquirySessionId }) => ({
			method: 'POST',
			path: `/inquiry-sessions/${encodeURIComponent(inquirySessionId)}/expire`,
		}),
		{ log: (_, result) => ({ sessionId: result.data?.id ?? undefined }) },
	);

export const expireAll: PersonaEndpoints['inquirySessionsExpireAll'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'inquirySessions.expireAll',
			input: Inputs.inquirySessionsExpireAll,
			output: Outputs.inquirySessionsExpireAll,
		},
		input,
		() => ({
			method: 'POST',
			path: '/inquiry-sessions/expire-all',
		}),
		{
			shape: (raw) => {
				// A 204 no-body answer means Persona accepted the expiry.
				if (raw !== undefined && raw !== null && raw !== '') {
					throw new Error(
						`Persona inquirySessions.expireAll: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { success: true };
			},
			log: (_parsed, result) => ({ success: result.success }),
		},
	);

export const generateOneTimeLink: PersonaEndpoints['inquirySessionsGenerateOneTimeLink'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inquirySessions.generateOneTimeLink',
				input: Inputs.inquirySessionsGenerateOneTimeLink,
				output: Outputs.inquirySessionsGenerateOneTimeLink,
			},
			input,
			({ inquirySessionId }) => ({
				method: 'POST',
				path: `/inquiry-sessions/${encodeURIComponent(inquirySessionId)}/generate-one-time-link`,
			}),
			{ log: (_, result) => ({ sessionId: result.data?.id ?? undefined }) },
		);
