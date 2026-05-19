import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import { makeTallyRequest } from '../client';
import type { TallyEndpointOutputs } from './types';

export const list: TallyEndpoints['webhookManagementList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;

	const result = await makeTallyRequest<
		TallyEndpointOutputs['webhookManagementList']
	>('webhooks', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'tally.webhookManagement.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TallyEndpoints['webhookManagementCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['webhookManagementCreate']
	>('webhooks', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	await logEventFromContext(
		ctx,
		'tally.webhookManagement.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TallyEndpoints['webhookManagementUpdate'] = async (
	ctx,
	input,
) => {
	const { webhookId, ...body } = input;
	const result = await makeTallyRequest<
		TallyEndpointOutputs['webhookManagementUpdate']
	>(`webhooks/${webhookId}`, ctx.key, {
		method: 'PATCH',
		body: { ...body },
	});

	await logEventFromContext(
		ctx,
		'tally.webhookManagement.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteWebhook: TallyEndpoints['webhookManagementDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['webhookManagementDelete']
	>(`webhooks/${input.webhookId}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'tally.webhookManagement.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const listEvents: TallyEndpoints['webhookManagementListEvents'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;

	const result = await makeTallyRequest<
		TallyEndpointOutputs['webhookManagementListEvents']
	>(`webhooks/${input.webhookId}/events`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'tally.webhookManagement.listEvents',
		{ ...input },
		'completed',
	);
	return result;
};

export const retryEvent: TallyEndpoints['webhookManagementRetryEvent'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['webhookManagementRetryEvent']
	>(`webhooks/${input.webhookId}/events/${input.eventId}`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'tally.webhookManagement.retryEvent',
		{ ...input },
		'completed',
	);
	return result;
};
