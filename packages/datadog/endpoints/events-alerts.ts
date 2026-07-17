import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs } from './types';

export const eventsList: DatadogEndpoints['eventsList'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['eventsList']
	>('/api/v1/events', ctx.key, {
		query: {
			start: input.start,
			end: input.end,
			priority: input.priority,
			sources: input.sources,
			tags: input.tags,
			page: input.page,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.events.list',
		{ count: response.events?.length ?? 0 },
		'completed',
	);
	return response;
};

export const eventsCreate: DatadogEndpoints['eventsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['eventsCreate']
	>('/api/v1/events', ctx.key, {
		method: 'POST',
		body: {
			title: input.title,
			text: input.text,
			tags: input.tags,
			alert_type: input.alertType,
			priority: input.priority,
			host: input.host,
			aggregation_key: input.aggregationKey,
			source_type_name: input.sourceTypeName,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.events.create',
		{ title: input.title },
		'completed',
	);
	return response;
};

export const downtimesList: DatadogEndpoints['downtimesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['downtimesList']
	>('/api/v2/downtime', ctx.key, {
		query: {
			current_only: input.currentOnly,
			'page[offset]': input.pageOffset,
			'page[limit]': input.pageLimit,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.downtimes.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const downtimesCreate: DatadogEndpoints['downtimesCreate'] = async (
	ctx,
	input,
) => {
	const monitorIdentifier =
		input.monitorId !== undefined
			? { monitor_id: input.monitorId }
			: { monitor_tags: ['*'] };

	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['downtimesCreate']
	>('/api/v2/downtime', ctx.key, {
		method: 'POST',
		body: {
			data: {
				type: 'downtime',
				attributes: {
					scope: input.scope,
					message: input.message,
					monitor_identifier: monitorIdentifier,
					schedule: {
						start: input.start,
						end: input.end,
						timezone: input.timezone,
					},
				},
			},
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.downtimes.create',
		{ scope: input.scope },
		'completed',
	);
	return response;
};

export const webhooksGet: DatadogEndpoints['webhooksGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['webhooksGet']
	>(
		'/api/v1/integration/webhooks/configuration/webhooks/{webhookName}',
		ctx.key,
		{
			path: { webhookName: input.webhookName },
		},
	);

	await logEventFromContext(
		ctx,
		'datadog.webhooks.get',
		{ webhookName: input.webhookName },
		'completed',
	);
	return response;
};

export const webhooksCreate: DatadogEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['webhooksCreate']
	>('/api/v1/integration/webhooks/configuration/webhooks', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			url: input.url,
			payload: input.payload,
			custom_headers: input.customHeaders,
			encode_as: input.encodeAs,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.webhooks.create',
		{ name: input.name },
		'completed',
	);
	return response;
};
