import { logEventFromContext } from 'corsair/core';
import { makeAltTextAiRequest } from '../client';
import type { AltTextAiEndpoints } from '../index';
import type { AltTextAiEndpointOutputs } from './types';

export const get: AltTextAiEndpoints['getAccount'] = async (ctx) => {
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['getAccount']
	>('/account', {
		apiKey: ctx.key,
	});

	await logEventFromContext(ctx, 'alttextai.account.get', {}, 'completed');
	return response;
};

export const update: AltTextAiEndpoints['updateAccount'] = async (
	ctx,
	input,
) => {
	// UpdateAccountInput wraps fields under `account`; cast satisfies JSON body typing.
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['updateAccount']
	>('/account', {
		apiKey: ctx.key,
		method: 'PUT',
		body: input as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'alttextai.account.update',
		{ ...input },
		'completed',
	);
	return response;
};
