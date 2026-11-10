import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { omit } from './omit';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const rulesList: MixmaxEndpoints['rulesList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['rulesList']>(
		ctx,
		'/v1/rules',
		{
			method: 'GET',
			query: {
				expand: input.expand,
				owner: input.owner,
				hidden: input.hidden,
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.rules.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const rulesCreate: MixmaxEndpoints['rulesCreate'] = async (
	ctx,
	input,
) => {
	const { ...rule } = input;
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['rulesCreate']>(
		ctx,
		'/v1/rules',
		{
			method: 'POST',
			body: rule,
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.rules.create',
		{
			// The trigger's webhook variant carries `webhookSecret`; the event
			// history records the rule name only, never the trigger payload.
			name: input.name,
		},
		'completed',
	);
	return result;
};

export const rulesGet: MixmaxEndpoints['rulesGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['rulesGet']>(
		ctx,
		mixmaxPathParameter('/v1/rules/{id}', 'id', input.id),
		{
			method: 'GET',
			query: {
				expand: input.expand,
			},
		},
	);

	await logEventFromContext(ctx, 'mixmax.rules.get', { ...input }, 'completed');
	return result;
};

export const rulesUpdate: MixmaxEndpoints['rulesUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...update } = input;
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['rulesUpdate']>(
		ctx,
		mixmaxPathParameter('/v1/rules/{id}', 'id', id),
		{
			method: 'PATCH',
			body: update,
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.rules.update',
		{
			// Same redaction as create: the trigger payload is never logged.
			id: input.id,
			name: input.name,
		},
		'completed',
	);
	return result;
};

export const rulesDelete: MixmaxEndpoints['rulesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['rulesDelete']>(
		ctx,
		mixmaxPathParameter('/v1/rules/{id}', 'id', input.id),
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'mixmax.rules.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const rulesDeleteBulk: MixmaxEndpoints['rulesDeleteBulk'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesDeleteBulk']
	>(ctx, '/v1/rules', {
		method: 'DELETE',
		body: {
			ids: input.ids,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.rules.deleteBulk',
		{ ...input },
		'completed',
	);
	return result;
};

export const rulesListActions: MixmaxEndpoints['rulesListActions'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesListActions']
	>(ctx, mixmaxPathParameter('/v1/rules/{id}/actions', 'id', input.id), {
		method: 'GET',
		query: {
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.rules.actions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const rulesCreateAction: MixmaxEndpoints['rulesCreateAction'] = async (
	ctx,
	input,
) => {
	const { id, ...action } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesCreateAction']
	>(ctx, mixmaxPathParameter('/v1/rules/{id}/actions', 'id', id), {
		method: 'POST',
		body: action,
	});

	await logEventFromContext(
		ctx,
		'mixmax.rules.actions.create',
		{
			// Webhook actions carry `signingSecret` and credential pairs in
			// `httpHeaders`; the event history records the action type only.
			id: input.id,
			type: input.type,
		},
		'completed',
	);
	return result;
};

export const rulesUpdateAction: MixmaxEndpoints['rulesUpdateAction'] = async (
	ctx,
	input,
) => {
	const { id, actionId, ...update } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesUpdateAction']
	>(
		ctx,
		mixmaxPathParameter(
			mixmaxPathParameter('/v1/rules/{id}/actions/{actionId}', 'id', id),
			'actionId',
			actionId,
		),
		{
			method: 'PATCH',
			body: update,
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.rules.actions.update',
		{
			// Same redaction as create: no secrets or header credentials.
			id: input.id,
			actionId: input.actionId,
		},
		'completed',
	);
	return result;
};

export const rulesDeleteAction: MixmaxEndpoints['rulesDeleteAction'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesDeleteAction']
	>(
		ctx,
		mixmaxPathParameter(
			mixmaxPathParameter('/v1/rules/{id}/actions/{actionId}', 'id', input.id),
			'actionId',
			input.actionId,
		),
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'mixmax.rules.actions.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const rulesListEvents: MixmaxEndpoints['rulesListEvents'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesListEvents']
	>(ctx, '/v1/rules/events', {
		method: 'GET',
		query: {
			userId: input.userId,
			getWorkspaceEvents: input.getWorkspaceEvents,
			ruleId: input.ruleId,
			status: input.status,
			text: input.text,
			aggregate: input.aggregate,
			fields: input.fields,
			offset: input.offset,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.rules.events.list',
		// The text filter can hold names or addresses; log its presence.
		{ ...omit(input, 'text'), hasText: input.text !== undefined },
		'completed',
	);
	return result;
};

export const rulesGetEvent: MixmaxEndpoints['rulesGetEvent'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['rulesGetEvent']
	>(ctx, mixmaxPathParameter('/v1/rules/events/{id}', 'id', input.id), {
		method: 'GET',
		query: {
			date: input.date,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.rules.events.get',
		{ ...input },
		'completed',
	);
	return result;
};
