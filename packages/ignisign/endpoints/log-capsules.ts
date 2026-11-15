import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { appEnvPath, makeIgnisignRequest } from '../client';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const create: IgnisignEndpoint<'logCapsules.create'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['logCapsules.create'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/log-capsules`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body: { hashSha256_b64: parsedInput.hashSha256_b64 },
	});
	const response =
		IgnisignEndpointOutputSchemas['logCapsules.create'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.logCapsules.create',
		{ appId: parsedInput.appId, appEnv: parsedInput.appEnv },
		'completed',
	);
	return response;
};

export const LogCapsulesEndpoints = {
	create,
} as const;
