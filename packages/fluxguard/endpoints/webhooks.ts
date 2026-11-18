import { asRecord } from 'corsair/core';
import type { FluxguardEndpoints } from '..';
import { call, toArray } from './call';
import {
	FluxguardEndpointInputSchemas as Inputs,
	FluxguardEndpointOutputSchemas as Outputs,
} from './types';

export const list: FluxguardEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/account/webhook' }),
		{
			// A bare array; an account with no webhooks answers `[]`.
			shape: (raw) => ({ webhooks: toArray(raw, 'webhook list') }),
			log: (_, result) => ({ count: result.webhooks.length }),
		},
	);

export const create: FluxguardEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		// Only `url` is honoured: `siteCategories` and `categories` are accepted
		// and silently ignored, so they are not sent.
		({ url }) => ({
			method: 'PUT',
			path: '/account/webhook',
			body: { url },
		}),
		{
			// The documented return is the id alone; keep the URL alongside it so
			// the result is self-describing.
			shape: (raw, { url }) => {
				const body = asRecord(raw);
				if (typeof body?.id !== 'string') {
					throw new Error('Fluxguard returned no webhook id');
				}
				return { url, id: body.id };
			},
			log: (_, result) => ({ webhookId: result.id }),
		},
	);

export const remove: FluxguardEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		// The id travels in the JSON body: a request without one answers 400
		// "Invalid request body", and a query parameter is ignored.
		({ id }) => ({
			method: 'DELETE',
			path: '/account/webhook',
			body: { id },
		}),
		{
			// Deletes an existing webhook with 204, and an unknown id with 204 too.
			shape: (_, { id }) => ({ success: true, id }),
			log: ({ id }) => ({ webhookId: id }),
		},
	);

export const sample: FluxguardEndpoints['webhooksSample'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.sample',
			input: Inputs.webhooksSample,
			output: Outputs.webhooksSample,
		},
		input,
		() => ({ method: 'GET', path: '/account/webhook/sample' }),
		{
			// A bare array of changes.
			shape: (raw) => ({ samples: toArray(raw, 'webhook sample') }),
			log: (_, result) => ({ count: result.samples.length }),
		},
	);
