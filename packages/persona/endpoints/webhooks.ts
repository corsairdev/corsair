import type { PersonaEndpoints } from '..';
import { attributesBody, call, metaBody, pageQuery, segment } from './call';
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
		(page) => ({
			method: 'GET',
			path: '/webhooks',
			query: pageQuery(page),
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
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
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/webhooks/${segment(webhookId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/webhooks/${segment(webhookId)}`,
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/webhooks/${segment(webhookId)}/enable`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/webhooks/${segment(webhookId)}/disable`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/webhooks/${segment(webhookId)}/archive`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ webhookId, expiresInSeconds }) => ({
			method: 'POST',
			path: `/webhooks/${segment(webhookId)}/rotate-secret`,
			body: metaBody({ 'expires-in-seconds': expiresInSeconds }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		(body) => ({
			method: 'POST',
			path: '/webhook-events/search',
			body,
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
	);
