import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List dashboards - GET /v2/dashboards
export const dashboardsList: DnsfilterEndpoints['dashboardsList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsList']
	>('/v2/dashboards', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Create a dashboard - POST /v2/dashboards
export const dashboardsCreate: DnsfilterEndpoints['dashboardsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsCreate']
	>('/v2/dashboards', ctx.key, {
		method: 'POST',
		body: {
			dashboard: input.dashboard,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.create',
		input ?? {},
		'completed',
	);
	return response;
};

// Available for dashboards - GET /v2/dashboards/available
export const dashboardsAvailable: DnsfilterEndpoints['dashboardsAvailable'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dashboardsAvailable']
		>('/v2/dashboards/available', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dashboards.available',
			input ?? {},
			'completed',
		);
		return response;
	};

// Owned for dashboards - GET /v2/dashboards/owned
export const dashboardsOwned: DnsfilterEndpoints['dashboardsOwned'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsOwned']
	>('/v2/dashboards/owned', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.owned',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a dashboard - PATCH /v2/dashboards/{id}
export const dashboardsUpdate: DnsfilterEndpoints['dashboardsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsUpdate']
	>('/v2/dashboards/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: input.id,
		},
		body: {
			dashboard: input.dashboard,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.update',
		input ?? {},
		'completed',
	);
	return response;
};

// Delete a dashboard - DELETE /v2/dashboards/{id}
export const dashboardsDelete: DnsfilterEndpoints['dashboardsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsDelete']
	>('/v2/dashboards/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.delete',
		input ?? {},
		'completed',
	);
	return response;
};

// Make public for dashboards - POST /v2/dashboards/{id}/make_public
export const dashboardsMakePublic: DnsfilterEndpoints['dashboardsMakePublic'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dashboardsMakePublic']
		>('/v2/dashboards/{id}/make_public', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dashboards.makePublic',
			input ?? {},
			'completed',
		);
		return response;
	};

// Make private for dashboards - POST /v2/dashboards/{id}/make_private
export const dashboardsMakePrivate: DnsfilterEndpoints['dashboardsMakePrivate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dashboardsMakePrivate']
		>('/v2/dashboards/{id}/make_private', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dashboards.makePrivate',
			input ?? {},
			'completed',
		);
		return response;
	};

// Link for dashboards - POST /v2/dashboards/{id}/link
export const dashboardsLink: DnsfilterEndpoints['dashboardsLink'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsLink']
	>('/v2/dashboards/{id}/link', ctx.key, {
		method: 'POST',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.link',
		input ?? {},
		'completed',
	);
	return response;
};

// Unlink for dashboards - POST /v2/dashboards/{id}/unlink
export const dashboardsUnlink: DnsfilterEndpoints['dashboardsUnlink'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsUnlink']
	>('/v2/dashboards/{id}/unlink', ctx.key, {
		method: 'POST',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.unlink',
		input ?? {},
		'completed',
	);
	return response;
};
