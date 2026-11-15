import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { appEnvPath, makeIgnisignRequest } from '../client';
import type { SignerProfile } from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const list: IgnisignEndpoint<'signerProfiles.list'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signerProfiles.list'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signer-profiles`;
	const response = await makeIgnisignRequest<SignerProfile[]>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['signerProfiles.list'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signerProfiles.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const get: IgnisignEndpoint<'signerProfiles.get'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signerProfiles.get'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signer-profiles/${encodeURIComponent(parsedInput.signerProfileId)}`;
	const response = await makeIgnisignRequest<SignerProfile>(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed =
		IgnisignEndpointOutputSchemas['signerProfiles.get'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.signerProfiles.get',
		{ signerProfileId: parsedInput.signerProfileId },
		'completed',
	);
	return parsed;
};

export const getInputsNeeded: IgnisignEndpoint<
	'signerProfiles.getInputsNeeded'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['signerProfiles.getInputsNeeded'].parse(input);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/signer-profiles/${encodeURIComponent(parsedInput.signerProfileId)}/inputs-needed`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const response =
		IgnisignEndpointOutputSchemas['signerProfiles.getInputsNeeded'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.signerProfiles.getInputsNeeded',
		{
			signerProfileId: parsedInput.signerProfileId,
			inputsNeededCount: response.inputsNeeded.length,
		},
		'completed',
	);
	return response;
};

export const SignerProfilesEndpoints = {
	list,
	get,
	getInputsNeeded,
} as const;
