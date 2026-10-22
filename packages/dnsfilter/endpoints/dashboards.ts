import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List dashboards - GET /v2/dashboards
export const dashboardsList: DnsfilterEndpoints['dashboardsList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsList']
	>('/v2/dashboards', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.dashboardsList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create a dashboard - POST /v2/dashboards
export const dashboardsCreate: DnsfilterEndpoints['dashboardsCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsCreate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsCreate']
	>('/v2/dashboards', ctx.key, {
		method: 'POST',
		body: {
			dashboard: values.dashboard,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.dashboardsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Available for dashboards - GET /v2/dashboards/available
export const dashboardsAvailable: DnsfilterEndpoints['dashboardsAvailable'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.dashboardsAvailable.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dashboardsAvailable']
		>('/v2/dashboards/available', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.dashboardsAvailable.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.dashboards.available',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Owned for dashboards - GET /v2/dashboards/owned
export const dashboardsOwned: DnsfilterEndpoints['dashboardsOwned'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsOwned.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsOwned']
	>('/v2/dashboards/owned', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.dashboardsOwned.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.owned',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a dashboard - PATCH /v2/dashboards/{id}
export const dashboardsUpdate: DnsfilterEndpoints['dashboardsUpdate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsUpdate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsUpdate']
	>('/v2/dashboards/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: values.id,
		},
		body: {
			dashboard: values.dashboard,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.dashboardsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.update',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete a dashboard - DELETE /v2/dashboards/{id}
export const dashboardsDelete: DnsfilterEndpoints['dashboardsDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsDelete.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsDelete']
	>('/v2/dashboards/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.dashboardsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Make public for dashboards - POST /v2/dashboards/{id}/make_public
export const dashboardsMakePublic: DnsfilterEndpoints['dashboardsMakePublic'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.dashboardsMakePublic.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dashboardsMakePublic']
		>('/v2/dashboards/{id}/make_public', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.dashboardsMakePublic.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.dashboards.makePublic',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Make private for dashboards - POST /v2/dashboards/{id}/make_private
export const dashboardsMakePrivate: DnsfilterEndpoints['dashboardsMakePrivate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.dashboardsMakePrivate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dashboardsMakePrivate']
		>('/v2/dashboards/{id}/make_private', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.dashboardsMakePrivate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.dashboards.makePrivate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Link for dashboards - POST /v2/dashboards/{id}/link
export const dashboardsLink: DnsfilterEndpoints['dashboardsLink'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsLink.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsLink']
	>('/v2/dashboards/{id}/link', ctx.key, {
		method: 'POST',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.dashboardsLink.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.link',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Unlink for dashboards - POST /v2/dashboards/{id}/unlink
export const dashboardsUnlink: DnsfilterEndpoints['dashboardsUnlink'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.dashboardsUnlink.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['dashboardsUnlink']
	>('/v2/dashboards/{id}/unlink', ctx.key, {
		method: 'POST',
		path: {
			id: values.id,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.dashboardsUnlink.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.dashboards.unlink',
		redactSensitive(values),
		'completed',
	);
	return result;
};
