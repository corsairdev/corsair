import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List block pages - GET /v1/block_pages
export const blockPagesList: DnsfilterEndpoints['blockPagesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesList']
	>('/v1/block_pages', ctx.key, {
		method: 'GET',
		query: {
			organization_id: input.organization_id,
			page: input.page,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Create a block page - POST /v1/block_pages
export const blockPagesCreate: DnsfilterEndpoints['blockPagesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesCreate']
	>('/v1/block_pages', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			organization_id: input.organization_id,
			block_org_name: input.block_org_name,
			block_email_addr: input.block_email_addr,
			block_logo_uuid: input.block_logo_uuid,
			created_at: input.created_at,
			updated_at: input.updated_at,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.create',
		input ?? {},
		'completed',
	);
	return response;
};

// List all block pages - GET /v1/block_pages/all
export const blockPagesListAll: DnsfilterEndpoints['blockPagesListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['blockPagesListAll']
		>('/v1/block_pages/all', ctx.key, {
			method: 'GET',
			query: {
				organization_id: input.organization_id,
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.blockPages.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a block page - GET /v1/block_pages/{id}
export const blockPagesGet: DnsfilterEndpoints['blockPagesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesGet']
	>('/v1/block_pages/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
		query: {
			include_relationships: input.include_relationships,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a block page - PATCH /v1/block_pages/{id}
export const blockPagesUpdate: DnsfilterEndpoints['blockPagesUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesUpdate']
	>('/v1/block_pages/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: input.id,
		},
		body: {
			name: input.name,
			organization_id: input.organization_id,
			block_org_name: input.block_org_name,
			block_email_addr: input.block_email_addr,
			block_logo_uuid: input.block_logo_uuid,
			created_at: input.created_at,
			updated_at: input.updated_at,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.update',
		input ?? {},
		'completed',
	);
	return response;
};

// Delete a block page - DELETE /v1/block_pages/{id}
export const blockPagesDelete: DnsfilterEndpoints['blockPagesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['blockPagesDelete']
	>('/v1/block_pages/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.blockPages.delete',
		input ?? {},
		'completed',
	);
	return response;
};
