import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { appEnvPath, makeIgnisignRequest } from '../client';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const signM2M: IgnisignEndpoint<'seal.signM2M'> = async (ctx, input) => {
	const parsedInput = IgnisignEndpointInputSchemas['seal.signM2M'].parse(input);
	const { appId, appEnv, m2mId, ...body } = parsedInput;
	const endpoint = `${appEnvPath(ctx.key, { appId, appEnv })}/m2m/${encodeURIComponent(m2mId)}/sign`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response =
		IgnisignEndpointOutputSchemas['seal.signM2M'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.seal.signM2M',
		{
			signatureRequestId: response.signatureRequestId,
			documentId: response.documentId,
		},
		'completed',
	);
	return response;
};

export const SealEndpoints = {
	signM2M,
} as const;
