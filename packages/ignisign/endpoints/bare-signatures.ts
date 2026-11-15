import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import {
	appEnvPath,
	makeIgnisignRequest,
	resolveAppEnv,
	resolveAppId,
} from '../client';
import type { BareSignatureProof } from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const getConfiguration: IgnisignEndpoint<
	'bareSignatures.getConfiguration'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['bareSignatures.getConfiguration'].parse(
			input,
		);
	const endpoint = `${appEnvPath(ctx.key, parsedInput)}/bare-signatures-configuration`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const response =
		IgnisignEndpointOutputSchemas['bareSignatures.getConfiguration'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.bareSignatures.getConfiguration',
		{ appId: parsedInput.appId, appEnv: parsedInput.appEnv },
		'completed',
	);
	return response;
};

export const getProofToken: IgnisignEndpoint<
	'bareSignatures.getProofToken'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['bareSignatures.getProofToken'].parse(input);
	const appId = resolveAppId(ctx.key, parsedInput.appId);
	const appEnv = resolveAppEnv(ctx.key, parsedInput.appEnv);
	const endpoint = `/v4/envs/${encodeURIComponent(appEnv)}/oauth2/proofs-token`;
	// The OAuth client is the application itself: IgniSign's SDK sends the app id
	// as client_id and the connection's API key as client_secret.
	const body = {
		client_id: appId,
		client_secret: ctx.key,
		code_verifier: parsedInput.code_verifier,
		redirect_uri: parsedInput.redirect_uri,
		grant_type: 'authorization_code',
		code: parsedInput.code,
	};
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body,
	});
	const response =
		IgnisignEndpointOutputSchemas['bareSignatures.getProofToken'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.bareSignatures.getProofToken',
		{ appEnv, tokenType: response.token_type },
		'completed',
	);
	return response;
};

export const getProofs: IgnisignEndpoint<'bareSignatures.getProofs'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['bareSignatures.getProofs'].parse(input);
	const appEnv = resolveAppEnv(ctx.key, parsedInput.appEnv);
	const endpoint = `/v4/envs/${encodeURIComponent(appEnv)}/bare-signatures/proofs`;
	// Bare signature proofs endpoint accepts token via Bearer header
	const response = await makeIgnisignRequest<BareSignatureProof>(
		endpoint,
		parsedInput.proofToken,
		{
			method: 'GET',
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['bareSignatures.getProofs'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.bareSignatures.getProofs',
		{
			appEnv,
			signatureRequestId: parsed.signatureRequestId,
		},
		'completed',
	);
	return parsed;
};

export const BareSignaturesEndpoints = {
	getConfiguration,
	getProofToken,
	getProofs,
} as const;
