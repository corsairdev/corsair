import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['outgoingWebhooksCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['outgoingWebhooksCreate']
	>('/api/v2/outgoing-webhooks', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			name: input.name,
			url: input.url,
			trigger_type: input.trigger_type,
			notify_alongside_primary_responder:
				input.notify_alongside_primary_responder,
			on_incident_started: input.on_incident_started,
			on_incident_acknowledged: input.on_incident_acknowledged,
			on_incident_resolved: input.on_incident_resolved,
			on_incident_reopened: input.on_incident_reopened,
			on_incident_comment: input.on_incident_comment,
			custom_webhook_template_attributes:
				input.custom_webhook_template_attributes,
		},
		idempotent: false,
	});

	await logEventFromContext(
		ctx,
		'betterstack.outgoingWebhooks.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['outgoingWebhooksGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['outgoingWebhooksGet']
	>(
		buildPath('/api/v2/outgoing-webhooks/{outgoing_webhook_id}', {
			outgoing_webhook_id: input.outgoing_webhook_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.outgoingWebhooks.get',
		auditPayload(input, ['outgoing_webhook_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['outgoingWebhooksList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['outgoingWebhooksList']
	>('/api/v2/outgoing-webhooks', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.outgoingWebhooks.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['outgoingWebhooksUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['outgoingWebhooksUpdate']
	>(
		buildPath('/api/v2/outgoing-webhooks/{outgoing_webhook_id}', {
			outgoing_webhook_id: input.outgoing_webhook_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				url: input.url,
				notify_alongside_primary_responder:
					input.notify_alongside_primary_responder,
				on_incident_started: input.on_incident_started,
				on_incident_acknowledged: input.on_incident_acknowledged,
				on_incident_resolved: input.on_incident_resolved,
				on_incident_reopened: input.on_incident_reopened,
				on_incident_comment: input.on_incident_comment,
				custom_webhook_template_attributes:
					input.custom_webhook_template_attributes,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.outgoingWebhooks.update',
		auditPayload(input, ['outgoing_webhook_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['outgoingWebhooksRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['outgoingWebhooksRemove']
	>(
		buildPath('/api/v2/outgoing-webhooks/{outgoing_webhook_id}', {
			outgoing_webhook_id: input.outgoing_webhook_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.outgoingWebhooks.remove',
		auditPayload(input, ['outgoing_webhook_id']),
		'completed',
	);
	return result;
};
