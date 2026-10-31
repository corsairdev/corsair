import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List block pages - GET /v1/block_pages
export const blockPagesList: DnsfilterEndpoints['blockPagesList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.blockPagesList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesList']
	>('/v1/block_pages', ctx.key, {
		method: 'GET',
		query: {
			organization_id: values.organization_id,
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.blockPagesList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create a block page - POST /v1/block_pages
export const blockPagesCreate: DnsfilterEndpoints['blockPagesCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.blockPagesCreate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesCreate']
	>('/v1/block_pages', ctx.key, {
		method: 'POST',
		body: {
			name: values.name,
			organization_id: values.organization_id,
			block_org_name: values.block_org_name,
			block_email_addr: values.block_email_addr,
			block_logo_uuid: values.block_logo_uuid,
			created_at: values.created_at,
			updated_at: values.updated_at,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.blockPagesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all block pages - GET /v1/block_pages/all
export const blockPagesListAll: DnsfilterEndpoints['blockPagesListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.blockPagesListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['blockPagesListAll']
		>('/v1/block_pages/all', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.blockPagesListAll.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.blockPages.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a block page - GET /v1/block_pages/{id}
export const blockPagesGet: DnsfilterEndpoints['blockPagesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.blockPagesGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesGet']
	>('/v1/block_pages/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
		query: {
			include_relationships: values.include_relationships,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.blockPagesGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a block page - PATCH /v1/block_pages/{id}
export const blockPagesUpdate: DnsfilterEndpoints['blockPagesUpdate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.blockPagesUpdate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesUpdate']
	>('/v1/block_pages/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: values.id,
		},
		body: {
			name: values.name,
			organization_id: values.organization_id,
			block_org_name: values.block_org_name,
			block_email_addr: values.block_email_addr,
			block_logo_uuid: values.block_logo_uuid,
			created_at: values.created_at,
			updated_at: values.updated_at,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.blockPagesUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.update',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete a block page - DELETE /v1/block_pages/{id}
export const blockPagesDelete: DnsfilterEndpoints['blockPagesDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.blockPagesDelete.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesDelete']
	>('/v1/block_pages/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.blockPagesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};
