import { asRecord } from 'corsair/core';
import type { PenpotEndpoints } from '..';
import { call, shapeDeleted } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

/**
 * get-webhooks answers each uri as a parsed object ({ scheme, host, port,
 * path, query, ... }, live 2026-11-21) while create answers a string; the
 * list is given the string form too.
 */
// unknown: one webhook record of the list, checked by the output schema next.
export function withUriString(webhook: unknown): unknown {
	const record = asRecord(webhook);
	const uri = asRecord(record?.uri);
	if (!record || !uri || typeof uri.host !== 'string') return webhook;
	const part = (key: string) =>
		typeof uri[key] === 'string' || typeof uri[key] === 'number'
			? String(uri[key])
			: '';
	const port = part('port') ? `:${part('port')}` : '';
	const query = part('query') ? `?${part('query')}` : '';
	const fragment = part('fragment') ? `#${part('fragment')}` : '';
	return {
		...record,
		uri: `${part('scheme') || 'https'}://${uri.host}${port}${part('path')}${query}${fragment}`,
	};
}

export const list: PenpotEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => 'get-webhooks',
		{
			body: ({ teamId }) => ({ teamId }),
			shape: (raw) => (Array.isArray(raw) ? raw.map(withUriString) : raw),
			log: (_, webhooks) => ({ count: webhooks.length }),
		},
	);

export const create: PenpotEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		() => 'create-webhook',
		{
			body: (input) => input,
			log: (_, webhook) => ({ webhookId: webhook.id ?? undefined }),
		},
	);

export const update: PenpotEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		() => 'update-webhook',
		{
			body: (input) => input,
			log: (_, webhook) => ({ webhookId: webhook.id ?? undefined }),
		},
	);

export const remove: PenpotEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		() => 'delete-webhook',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ webhookId: result.id }),
		},
	);
