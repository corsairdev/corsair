import type { PolygonEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ status, limit, cursor }) => ({
			method: 'GET',
			path: '/webhooks',
			query: { status, limit, cursor },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PolygonEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhookId }) => ({
			method: 'GET',
			path: `/webhooks/${segment(webhookId)}`,
		}),
		{ log: ({ webhookId }) => ({ webhookId }) },
	);

export const create: PolygonEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({
			idempotencyKey: _ignored,
			url,
			subscriptions,
			timeoutMs,
			notifyThresholdSecs,
		}) => ({
			method: 'POST',
			path: '/webhooks',
			body: { url, subscriptions, timeoutMs, notifyThresholdSecs },
		}),
		{
			// The signing key is returned once; the id is the safe thing to log.
			log: (_, result) => ({ webhookId: result.webhook.id ?? undefined }),
		},
	);

export const update: PolygonEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhookId, url, subscriptions, timeoutMs, notifyThresholdSecs }) => ({
			method: 'PATCH',
			path: `/webhooks/${segment(webhookId)}`,
			body: { url, subscriptions, timeoutMs, notifyThresholdSecs },
		}),
		{ log: ({ webhookId }) => ({ webhookId }) },
	);

export const remove: PolygonEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ webhookId }) => ({
			method: 'DELETE',
			path: `/webhooks/${segment(webhookId)}`,
		}),
		{ log: ({ webhookId }) => ({ webhookId }) },
	);
