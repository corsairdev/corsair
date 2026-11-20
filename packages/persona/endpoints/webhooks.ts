import type { PersonaEndpoints } from '..';
import { attributesBody, call } from './call';
import {
	PersonaEndpointInputSchemas as Inputs,
	PersonaEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersonaEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/webhooks' }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: PersonaEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ attributes }) => ({
			method: 'POST',
			path: '/webhooks',
			body: attributesBody(attributes),
		}),
		{
			// The signing secret is not logged, only the webhook id.
			log: (_, result) => ({ webhookId: result.data?.id ?? undefined }),
		},
	);

export const get: PersonaEndpoints['webhooksGet'] = (ctx, input) =>
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
			path: `/webhooks/${encodeURIComponent(webhookId)}`,
		}),
		{ log: (_, result) => ({ webhookId: result.data?.id ?? undefined }) },
	);

export const update: PersonaEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhookId, attributes }) => ({
			method: 'PATCH',
			path: `/webhooks/${encodeURIComponent(webhookId)}`,
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ webhookId: result.data?.id ?? undefined }) },
	);

export const enable: PersonaEndpoints['webhooksEnable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.enable',
			input: Inputs.webhooksEnable,
			output: Outputs.webhooksEnable,
		},
		input,
		({ webhookId }) => ({
			method: 'POST',
			path: `/webhooks/${encodeURIComponent(webhookId)}/enable`,
		}),
		{ log: (_, result) => ({ webhookId: result.data?.id ?? undefined }) },
	);

export const disable: PersonaEndpoints['webhooksDisable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.disable',
			input: Inputs.webhooksDisable,
			output: Outputs.webhooksDisable,
		},
		input,
		({ webhookId }) => ({
			method: 'POST',
			path: `/webhooks/${encodeURIComponent(webhookId)}/disable`,
		}),
		{ log: (_, result) => ({ webhookId: result.data?.id ?? undefined }) },
	);

export const archive: PersonaEndpoints['webhooksArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.archive',
			input: Inputs.webhooksArchive,
			output: Outputs.webhooksArchive,
		},
		input,
		({ webhookId }) => ({
			method: 'POST',
			path: `/webhooks/${encodeURIComponent(webhookId)}/archive`,
		}),
		{ log: (_, result) => ({ webhookId: result.data?.id ?? undefined }) },
	);

export const rotateSecret: PersonaEndpoints['webhooksRotateSecret'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.rotateSecret',
			input: Inputs.webhooksRotateSecret,
			output: Outputs.webhooksRotateSecret,
		},
		input,
		({ webhookId }) => ({
			method: 'POST',
			path: `/webhooks/${encodeURIComponent(webhookId)}/rotate-secret`,
		}),
		{
			// The new secret value is not logged, only that the rotation ran.
			log: (_, result) => ({ webhookId: result.data?.id ?? undefined }),
		},
	);

export const searchEvents: PersonaEndpoints['webhookEventsSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookEvents.search',
			input: Inputs.webhookEventsSearch,
			output: Outputs.webhookEventsSearch,
		},
		input,
		({ query }) => ({
			method: 'POST',
			path: '/webhook-events/search',
			body: query === undefined ? undefined : { query },
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
