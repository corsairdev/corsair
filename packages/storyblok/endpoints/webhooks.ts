import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		(query) => ({ method: 'GET', path: '/webhook_endpoints', query }),
		{ log: (_, result) => ({ count: result.webhook_endpoints.length }) },
	);

export const get: StoryblokEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhook_endpoint_id }) => ({
			method: 'GET',
			path: `/webhook_endpoints/${segment(webhook_endpoint_id)}`,
		}),
		{ log: ({ webhook_endpoint_id }) => ({ webhookId: webhook_endpoint_id }) },
	);

export const create: StoryblokEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(webhook_endpoint) => ({
			method: 'POST',
			path: '/webhook_endpoints',
			body: { webhook_endpoint },
		}),
		{
			log: (_, result) => ({
				webhookId: result.webhook_endpoint.id ?? undefined,
			}),
		},
	);

export const update: StoryblokEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhook_endpoint_id, ...webhook_endpoint }) => ({
			method: 'PUT',
			path: `/webhook_endpoints/${segment(webhook_endpoint_id)}`,
			body: { webhook_endpoint },
		}),
		{ log: ({ webhook_endpoint_id }) => ({ webhookId: webhook_endpoint_id }) },
	);

export const remove: StoryblokEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ webhook_endpoint_id }) => ({
			method: 'DELETE',
			path: `/webhook_endpoints/${segment(webhook_endpoint_id)}`,
		}),
		{ log: ({ webhook_endpoint_id }) => ({ webhookId: webhook_endpoint_id }) },
	);

/**
 * The accepted action names, read from Storyblok rather than hardcoded: the set
 * changes as new events ship, and a stale list would reject a valid webhook.
 */
export const listActions: StoryblokEndpoints['webhooksListActions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.listActions',
			input: Inputs.webhooksListActions,
			output: Outputs.webhooksListActions,
		},
		input,
		() => ({ method: 'GET', path: '/webhook_endpoints/allowed_actions' }),
		{ log: (_, result) => ({ count: result.allowed_actions.length }) },
	);
