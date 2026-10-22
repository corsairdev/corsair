import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Get a domain note - GET /v1/notes/{resource}/{id}/{domain}
export const domainNotesGet: DnsfilterEndpoints['domainNotesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['domainNotesGet']
	>('/v1/notes/{resource}/{id}/{domain}', ctx.key, {
		method: 'GET',
		path: {
			domain: input.domain,
			id: input.id,
			resource: input.resource,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.domainNotes.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a domain note - PATCH /v1/notes/{resource}/{id}/{domain}
export const domainNotesUpdate: DnsfilterEndpoints['domainNotesUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesUpdate']
		>('/v1/notes/{resource}/{id}/{domain}', ctx.key, {
			method: 'PATCH',
			path: {
				domain: input.domain,
				id: input.id,
				resource: input.resource,
			},
			body: {
				body: input.body,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Batch update for domain notes - PATCH /v1/notes/{resource}/{id}/batch_update
export const domainNotesBatchUpdate: DnsfilterEndpoints['domainNotesBatchUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesBatchUpdate']
		>('/v1/notes/{resource}/{id}/batch_update', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
				resource: input.resource,
			},
			query: {
				append: input.append,
				notes: input.notes,
				organization_ids: input.organization_ids,
				single_note: input.single_note,
				type: input.type,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.batchUpdate',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a domain note - DELETE /v1/notes/{resource}/{id}/notes/{domain}
export const domainNotesDelete: DnsfilterEndpoints['domainNotesDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesDelete']
		>('/v1/notes/{resource}/{id}/notes/{domain}', ctx.key, {
			method: 'DELETE',
			path: {
				domain: input.domain,
				id: input.id,
				resource: input.resource,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.delete',
			input ?? {},
			'completed',
		);
		return response;
	};

// Batch destroy for domain notes - DELETE /v1/notes/{resource}/{id}/notes/batch_destroy
export const domainNotesBatchDestroy: DnsfilterEndpoints['domainNotesBatchDestroy'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainNotesBatchDestroy']
		>('/v1/notes/{resource}/{id}/notes/batch_destroy', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
				resource: input.resource,
			},
			query: {
				domains: input.domains,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domainNotes.batchDestroy',
			input ?? {},
			'completed',
		);
		return response;
	};
