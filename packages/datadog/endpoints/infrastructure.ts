import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs } from './types';

export const hostsList: DatadogEndpoints['hostsList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['hostsList']
	>('/api/v1/hosts', ctx.key, {
		query: {
			filter: input.filter,
			sort_field: input.sortField,
			sort_dir: input.sortDir,
			start: input.start,
			count: input.count,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.hosts.list',
		{
			totalMatching: response.total_matching,
			totalReturned: response.total_returned,
		},
		'completed',
	);
	return response;
};

export const hostsTotals: DatadogEndpoints['hostsTotals'] = async (
	ctx,
	_input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['hostsTotals']
	>('/api/v1/hosts/totals', ctx.key);

	await logEventFromContext(
		ctx,
		'datadog.hosts.totals',
		{ totalActive: response.total_active, totalUp: response.total_up },
		'completed',
	);
	return response;
};

export const tagsList: DatadogEndpoints['tagsList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<DatadogEndpointOutputs['tagsList']>(
		'/api/v1/tags/hosts',
		ctx.key,
		{
			query: { source: input.source },
		},
	);

	await logEventFromContext(
		ctx,
		'datadog.tags.list',
		{ tagCount: Object.keys(response.tags ?? {}).length },
		'completed',
	);
	return response;
};

export const tagsGetHost: DatadogEndpoints['tagsGetHost'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['tagsGetHost']
	>('/api/v1/tags/hosts/{hostName}', ctx.key, {
		path: { hostName: input.hostName },
		query: { source: input.source },
	});

	await logEventFromContext(
		ctx,
		'datadog.tags.getHost',
		{ hostName: input.hostName },
		'completed',
	);
	return response;
};

export const tagsUpdateHost: DatadogEndpoints['tagsUpdateHost'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['tagsUpdateHost']
	>('/api/v1/tags/hosts/{hostName}', ctx.key, {
		method: 'PUT',
		path: { hostName: input.hostName },
		query: { source: input.source },
		body: { tags: input.tags },
	});

	await logEventFromContext(
		ctx,
		'datadog.tags.updateHost',
		{ hostName: input.hostName, tagCount: input.tags.length },
		'completed',
	);
	return response;
};
