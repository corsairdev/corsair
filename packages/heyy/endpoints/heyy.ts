import { asRecord } from 'corsair/core';
import type { HeyyEndpoints } from '..';
import { call, searchBody } from './call';
import {
	HeyyEndpointInputSchemas as Inputs,
	HeyyEndpointOutputSchemas as Outputs,
} from './types';

// unknown: `data` is the provider's payload, which the output schema validates.
function dataOf(raw: unknown): unknown {
	return asRecord(raw)?.data;
}

// unknown: `pagination`, present on every search response.
function paginationOf(raw: unknown): unknown {
	return asRecord(raw)?.pagination;
}

// unknown: `success`, a literal true on every success envelope.
function successOf(raw: unknown): unknown {
	return asRecord(raw)?.success;
}

/**
 * The rows a search returns plus the paging envelope.
 *
 * Every search route puts its rows in `data` as a flat array, not nested under
 * a resource-named key, so `key` only names the field this plugin exposes them
 * as. Verified against all seven search operations in the v3 spec.
 */
// unknown: `rows` is the provider's array, which the output schema validates.
function searchResult(raw: unknown, key: string) {
	const rows = dataOf(raw);
	return {
		[key]: Array.isArray(rows) ? rows : [],
		pagination: paginationOf(raw),
		success: successOf(raw),
	};
}

export const contactsSearch: HeyyEndpoints['contactsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.search',
			input: Inputs.contactsSearch,
			output: Outputs.contactsSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/contacts/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'contacts'),
			log: (parsed, result) => ({
				count: result.contacts.length,
				total: result.pagination.total,
				page: parsed.pagination?.page,
			}),
		},
	);

export const contactsCreate: HeyyEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/contacts',
			body: {
				firstName: parsed.firstName,
				lastName: parsed.lastName,
				phoneNumber: parsed.phoneNumber,
				email: parsed.email,
				attributes: parsed.attributes,
				labels: parsed.labels,
			},
		}),
		{
			shape: (raw) => ({
				contact: dataOf(raw),
				success: successOf(raw),
			}),
			log: (_, result) => ({ contactId: result.contact.id }),
		},
	);

export const attributesSearch: HeyyEndpoints['attributesSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attributes.search',
			input: Inputs.attributesSearch,
			output: Outputs.attributesSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/attributes/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'attributes'),
			log: (_, result) => ({
				count: result.attributes.length,
				total: result.pagination.total,
			}),
		},
	);

export const attributesCreate: HeyyEndpoints['attributesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attributes.create',
			input: Inputs.attributesCreate,
			output: Outputs.attributesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/attributes',
			body: {
				type: parsed.type,
				displayName: parsed.displayName,
				visibility: parsed.visibility,
				details: parsed.details,
			},
		}),
		{
			shape: (raw) => ({
				attribute: dataOf(raw),
				success: successOf(raw),
			}),
			log: (parsed, result) => ({
				attributeId: result.attribute.id,
				type: parsed.type,
			}),
		},
	);

export const attributesRemove: HeyyEndpoints['attributesRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attributes.remove',
			input: Inputs.attributesRemove,
			output: Outputs.attributesRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/attributes/${encodeURIComponent(parsed.attributeId)}`,
		}),
		{
			shape: (raw) => ({
				result: dataOf(raw),
				success: successOf(raw),
			}),
			log: (parsed) => ({ attributeId: parsed.attributeId }),
		},
	);

export const labelsSearch: HeyyEndpoints['labelsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'labels.search',
			input: Inputs.labelsSearch,
			output: Outputs.labelsSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/labels/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'labels'),
			log: (_, result) => ({
				count: result.labels.length,
				total: result.pagination.total,
			}),
		},
	);

export const labelsCreate: HeyyEndpoints['labelsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'labels.create',
			input: Inputs.labelsCreate,
			output: Outputs.labelsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/labels',
			body: { name: parsed.name, color: parsed.color },
		}),
		{
			shape: (raw) => ({
				label: dataOf(raw),
				success: successOf(raw),
			}),
			log: (_, result) => ({ labelId: result.label.id }),
		},
	);

export const labelsRemove: HeyyEndpoints['labelsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'labels.remove',
			input: Inputs.labelsRemove,
			output: Outputs.labelsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/labels/${encodeURIComponent(parsed.labelId)}`,
		}),
		{
			shape: (raw) => ({
				result: dataOf(raw),
				success: successOf(raw),
			}),
			log: (parsed) => ({ labelId: parsed.labelId }),
		},
	);

export const apiWebhooksCreate: HeyyEndpoints['apiWebhooksCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiWebhooks.create',
			input: Inputs.apiWebhooksCreate,
			output: Outputs.apiWebhooksCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api_webhooks',
			body: { url: parsed.url, events: parsed.events },
		}),
		{
			shape: (raw) => ({
				webhook: dataOf(raw),
				success: successOf(raw),
			}),
			log: (parsed, result) => ({
				webhookId: result.webhook.id,
				events: parsed.events.length,
			}),
		},
	);

export const apiWebhooksSearch: HeyyEndpoints['apiWebhooksSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiWebhooks.search',
			input: Inputs.apiWebhooksSearch,
			output: Outputs.apiWebhooksSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api_webhooks/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'webhooks'),
			log: (_, result) => ({
				count: result.webhooks.length,
				total: result.pagination.total,
			}),
		},
	);

export const apiWebhooksUpdate: HeyyEndpoints['apiWebhooksUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiWebhooks.update',
			input: Inputs.apiWebhooksUpdate,
			output: Outputs.apiWebhooksUpdate,
		},
		input,
		(parsed) => {
			// Only the fields to change go in the body.
			const body: Record<string, unknown> = {}; // unknown: only set fields go in.
			if (parsed.url !== undefined) body.url = parsed.url;
			if (parsed.status !== undefined) body.status = parsed.status;
			if (parsed.events !== undefined) body.events = parsed.events;
			return {
				method: 'PUT',
				path: `/api_webhooks/${encodeURIComponent(parsed.webhookId)}`,
				body,
			};
		},
		{
			shape: (raw) => ({
				webhook: dataOf(raw),
				success: successOf(raw),
			}),
			log: (parsed, result) => ({
				webhookId: result.webhook.id,
				status: parsed.status,
			}),
		},
	);

export const apiWebhooksRemove: HeyyEndpoints['apiWebhooksRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'apiWebhooks.remove',
			input: Inputs.apiWebhooksRemove,
			output: Outputs.apiWebhooksRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api_webhooks/${encodeURIComponent(parsed.webhookId)}`,
		}),
		{
			shape: (raw) => ({
				result: dataOf(raw),
				success: successOf(raw),
			}),
			log: (parsed) => ({ webhookId: parsed.webhookId }),
		},
	);

export const channelsSearch: HeyyEndpoints['channelsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'channels.search',
			input: Inputs.channelsSearch,
			output: Outputs.channelsSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/channels/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'channels'),
			log: (_, result) => ({
				count: result.channels.length,
				total: result.pagination.total,
			}),
		},
	);

export const automationsSearch: HeyyEndpoints['automationsSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'automations.search',
			input: Inputs.automationsSearch,
			output: Outputs.automationsSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/automations/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'automations'),
			log: (_, result) => ({
				count: result.automations.length,
				total: result.pagination.total,
			}),
		},
	);

export const messageTemplatesSearch: HeyyEndpoints['messageTemplatesSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messageTemplates.search',
			input: Inputs.messageTemplatesSearch,
			output: Outputs.messageTemplatesSearch,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/message_templates/search',
			body: searchBody(parsed),
		}),
		{
			shape: (raw) => searchResult(raw, 'messageTemplates'),
			log: (_, result) => ({
				count: result.messageTemplates.length,
				total: result.pagination.total,
			}),
		},
	);
