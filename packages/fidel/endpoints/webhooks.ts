import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

// Custom webhook headers usually carry the receiver's own credential (an
// Authorization value or a shared secret). The provider gets the real
// values; the event log keeps only the header names.
// unknown: header values are caller-defined and are never read here.
const withoutHeaderValues = <T extends { headers?: Record<string, unknown> }>(
	input: T,
): T =>
	input.headers
		? {
				...input,
				headers: Object.fromEntries(
					Object.keys(input.headers).map((name) => [name, '[redacted]']),
				),
			}
		: input;

export const createBrandWebhook: FidelEndpoints['createBrandWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['createBrandWebhook']
	>(ctx, '/v1/hooks', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'fidel.webhooks.createBrandWebhook',
		withoutHeaderValues(input),
		'completed',
	);
	return response;
};

export const createProgramWebhook: FidelEndpoints['createProgramWebhook'] =
	async (ctx, input) => {
		const { programId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['createProgramWebhook']
		>(
			ctx,
			fidelPathParameter(
				'/v1/programs/{programId}/hooks',
				'programId',
				input.programId,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.webhooks.createProgramWebhook',
			withoutHeaderValues(input),
			'completed',
		);
		return response;
	};

export const retrieveWebhook: FidelEndpoints['retrieveWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['retrieveWebhook']
	>(ctx, fidelPathParameter('/v1/hooks/{hookId}', 'hookId', input.hookId), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'fidel.webhooks.retrieveWebhook',
		input,
		'completed',
	);
	return response;
};

export const updateWebhook: FidelEndpoints['updateWebhook'] = async (
	ctx,
	input,
) => {
	const { hookId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['updateWebhook']
	>(ctx, fidelPathParameter('/v1/hooks/{hookId}', 'hookId', input.hookId), {
		method: 'PATCH',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'fidel.webhooks.updateWebhook',
		withoutHeaderValues(input),
		'completed',
	);
	return response;
};

export const listWebhooks: FidelEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<FidelEndpointOutputs['listWebhooks']>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/hooks',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.webhooks.listWebhooks',
		input,
		'completed',
	);
	return response;
};

export const deleteWebhook: FidelEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['deleteWebhook']
	>(ctx, fidelPathParameter('/v1/hooks/{hookId}', 'hookId', input.hookId), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'fidel.webhooks.deleteWebhook',
		input,
		'completed',
	);
	return response;
};
