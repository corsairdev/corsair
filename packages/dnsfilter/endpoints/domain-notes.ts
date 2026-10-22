import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Get a domain note - GET /v1/notes/{resource}/{id}/{domain}
export const domainNotesGet: DnsfilterEndpoints['domainNotesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.domainNotesGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['domainNotesGet']
	>('/v1/notes/{resource}/{id}/{domain}', ctx.key, {
		method: 'GET',
		path: {
			domain: values.domain,
			id: values.id,
			resource: values.resource,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.domainNotesGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.domainNotes.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a domain note - PATCH /v1/notes/{resource}/{id}/{domain}
export const domainNotesUpdate: DnsfilterEndpoints['domainNotesUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainNotesUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesUpdate']
		>('/v1/notes/{resource}/{id}/{domain}', ctx.key, {
			method: 'PATCH',
			path: {
				domain: values.domain,
				id: values.id,
				resource: values.resource,
			},
			body: values.body,
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainNotesUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Batch update for domain notes - PATCH /v1/notes/{resource}/{id}/batch_update
export const domainNotesBatchUpdate: DnsfilterEndpoints['domainNotesBatchUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainNotesBatchUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesBatchUpdate']
		>('/v1/notes/{resource}/{id}/batch_update', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
				resource: values.resource,
			},
			query: {
				append: values.append,
				notes: values.notes,
				organization_ids: values.organization_ids,
				single_note: values.single_note,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainNotesBatchUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.batchUpdate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a domain note - DELETE /v1/notes/{resource}/{id}/notes/{domain}
export const domainNotesDelete: DnsfilterEndpoints['domainNotesDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainNotesDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesDelete']
		>('/v1/notes/{resource}/{id}/notes/{domain}', ctx.key, {
			method: 'DELETE',
			path: {
				domain: values.domain,
				id: values.id,
				resource: values.resource,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainNotesDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Batch destroy for domain notes - DELETE /v1/notes/{resource}/{id}/notes/batch_destroy
export const domainNotesBatchDestroy: DnsfilterEndpoints['domainNotesBatchDestroy'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainNotesBatchDestroy.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesBatchDestroy']
		>('/v1/notes/{resource}/{id}/notes/batch_destroy', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
				resource: values.resource,
			},
			query: {
				domains: values.domains,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainNotesBatchDestroy.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.batchDestroy',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
