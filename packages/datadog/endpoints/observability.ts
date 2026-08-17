import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs } from './types';

export const servicesListDefinitions: DatadogEndpoints['servicesListDefinitions'] =
	async (ctx, input) => {
		const response = await makeDatadogRequest<
			DatadogEndpointOutputs['servicesListDefinitions']
		>('/api/v2/services/definitions', ctx.key, {
			query: {
				'page[size]': input.pageSize,
				'page[number]': input.pageNumber,
				schema_version: input.schemaVersion,
			},
		});

		await logEventFromContext(
			ctx,
			'datadog.services.listDefinitions',
			{ count: response.data?.length ?? 0 },
			'completed',
		);
		return response;
	};

export const spansSearch: DatadogEndpoints['spansSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['spansSearch']
	>('/api/v2/spans/events/search', ctx.key, {
		method: 'POST',
		body: {
			data: {
				type: 'search_request',
				attributes: {
					filter: {
						query: input.query,
						from: input.from,
						to: input.to,
					},
					sort: input.sort,
					page: {
						limit: input.pageLimit,
						cursor: input.pageCursor,
					},
				},
			},
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.spans.search',
		{ query: input.query, count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const spansAggregate: DatadogEndpoints['spansAggregate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['spansAggregate']
	>('/api/v2/spans/analytics/aggregate', ctx.key, {
		method: 'POST',
		body: {
			data: {
				type: 'aggregate_request',
				attributes: {
					filter: {
						query: input.query,
						from: input.from,
						to: input.to,
					},
					compute: [
						{
							aggregation: input.aggregation,
							metric: input.metric,
						},
					],
					...(input.groupBy ? { group_by: [{ facet: input.groupBy }] } : {}),
				},
			},
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.spans.aggregate',
		{ query: input.query, aggregation: input.aggregation },
		'completed',
	);
	return response;
};

export const logsSearch: DatadogEndpoints['logsSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['logsSearch']
	>('/api/v2/logs/events/search', ctx.key, {
		method: 'POST',
		body: {
			filter: {
				query: input.query,
				from: input.from,
				to: input.to,
				indexes: input.indexes,
			},
			sort: input.sort,
			page: {
				limit: input.pageLimit,
				cursor: input.pageCursor,
			},
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.logs.search',
		{ query: input.query, count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const logsAggregate: DatadogEndpoints['logsAggregate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['logsAggregate']
	>('/api/v2/logs/analytics/aggregate', ctx.key, {
		method: 'POST',
		body: {
			filter: {
				query: input.query,
				from: input.from,
				to: input.to,
			},
			compute: [
				{
					aggregation: input.aggregation,
					metric: input.metric,
				},
			],
			...(input.groupBy ? { group_by: [{ facet: input.groupBy }] } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.logs.aggregate',
		{ query: input.query, aggregation: input.aggregation },
		'completed',
	);
	return response;
};

export const logsListIndexes: DatadogEndpoints['logsListIndexes'] = async (
	ctx,
	_input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['logsListIndexes']
	>('/api/v1/logs/config/indexes', ctx.key);

	await logEventFromContext(
		ctx,
		'datadog.logs.listIndexes',
		{ count: response.indexes?.length ?? 0 },
		'completed',
	);
	return response;
};

export const metricsListActive: DatadogEndpoints['metricsListActive'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['metricsListActive']
	>('/api/v1/metrics', ctx.key, {
		query: {
			from: input.from,
			host: input.host,
			tag_filter: input.tagFilter,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.metrics.listActive',
		{ count: response.metrics?.length ?? 0 },
		'completed',
	);
	return response;
};

export const metricsQuery: DatadogEndpoints['metricsQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['metricsQuery']
	>('/api/v1/query', ctx.key, {
		query: {
			query: input.query,
			from: input.from,
			to: input.to,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.metrics.query',
		{ query: input.query, seriesCount: response.series?.length ?? 0 },
		'completed',
	);
	return response;
};

export const metricsSubmit: DatadogEndpoints['metricsSubmit'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['metricsSubmit']
	>('/api/v1/series', ctx.key, {
		method: 'POST',
		body: { series: input.series },
	});

	await logEventFromContext(
		ctx,
		'datadog.metrics.submit',
		{ seriesCount: input.series.length },
		'completed',
	);
	return response;
};
