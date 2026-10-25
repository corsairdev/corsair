// DNSFilter domains and domain notes endpoints.
// One file per resource family; each endpoint keeps its own group name.
import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// User lookup for domains - GET /v1/domains/user_lookup
export const domainsUserLookup: DnsfilterEndpoints['domainsUserLookup'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainsUserLookup.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsUserLookup']
		>('/v1/domains/user_lookup', ctx.key, {
			method: 'GET',
			query: {
				fqdn: values.fqdn,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainsUserLookup.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.userLookup',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk lookup for domains - GET /v1/domains/bulk_lookup
export const domainsBulkLookup: DnsfilterEndpoints['domainsBulkLookup'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainsBulkLookup.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsBulkLookup']
		>('/v1/domains/bulk_lookup', ctx.key, {
			method: 'GET',
			query: {
				fqdns: values.fqdns,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainsBulkLookup.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.bulkLookup',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Suggest threat for domains - POST /v1/domains/suggest_threat
export const domainsSuggestThreat: DnsfilterEndpoints['domainsSuggestThreat'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainsSuggestThreat.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsSuggestThreat']
		>('/v1/domains/suggest_threat', ctx.key, {
			method: 'POST',
			query: {
				categories: values.categories,
				fqdn: values.fqdn,
				notes: values.notes,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainsSuggestThreat.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.suggestThreat',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

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
