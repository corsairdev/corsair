import { logEventFromContext } from 'corsair/core';
import type { WisprFlowEndpoints } from '..';
import { makeWisprFlowRequest } from '../client';
import {
	WisprFlowEndpointInputSchemas,
	WisprFlowEndpointOutputSchemas,
} from './types';

export const generate: WisprFlowEndpoints['tokensGenerate'] = async (
	ctx,
	input,
) => {
	const body = WisprFlowEndpointInputSchemas.tokensGenerate.parse(input);
	const response = WisprFlowEndpointOutputSchemas.tokensGenerate.parse(
		await makeWisprFlowRequest('/generate_access_token', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'wisprflow.tokens.generate',
		// client_id is the caller's own identifier and can be an email address, so only the lifetime is logged.
		{ duration_secs: body.duration_secs },
		'completed',
	);
	return response;
};

export const revoke: WisprFlowEndpoints['tokensRevoke'] = async (
	ctx,
	input,
) => {
	const body = WisprFlowEndpointInputSchemas.tokensRevoke.parse(input);
	const response = WisprFlowEndpointOutputSchemas.tokensRevoke.parse(
		await makeWisprFlowRequest('/revoke_token', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	await logEventFromContext(ctx, 'wisprflow.tokens.revoke', {}, 'completed');
	return response;
};

export const revokeClient: WisprFlowEndpoints['tokensRevokeClient'] = async (
	ctx,
	input,
) => {
	const body = WisprFlowEndpointInputSchemas.tokensRevokeClient.parse(input);
	const response = WisprFlowEndpointOutputSchemas.tokensRevokeClient.parse(
		await makeWisprFlowRequest('/revoke_client_tokens', ctx.key, {
			method: 'POST',
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'wisprflow.tokens.revokeClient',
		{},
		'completed',
	);
	return response;
};
