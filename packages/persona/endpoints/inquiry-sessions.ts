import type { PersonaEndpoints } from '..';
import { attributesBody, call, metaBody, segment } from './call';
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
		({ inquiryId }) => ({
			method: 'POST',
			path: '/inquiry-sessions',
			body: attributesBody({ 'inquiry-id': inquiryId }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/inquiry-sessions/${segment(inquirySessionId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/inquiry-sessions/${segment(inquirySessionId)}/expire`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ inquiryIds }) => ({
			method: 'POST',
			path: '/inquiry-sessions/expire-all',
			body: metaBody({ 'inquiry-ids': inquiryIds }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
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
				path: `/inquiry-sessions/${segment(inquirySessionId)}/generate-one-time-link`,
			}),
			{ log: (_, result) => ({ id: result.data.id }) },
		);
