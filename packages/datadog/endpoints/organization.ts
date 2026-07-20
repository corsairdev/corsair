import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs } from './types';

export const usersList: DatadogEndpoints['usersList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['usersList']
	>('/api/v2/users', ctx.key, {
		query: {
			'page[size]': input.pageSize,
			'page[number]': input.pageNumber,
			filter: input.filter,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.users.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const rolesList: DatadogEndpoints['rolesList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['rolesList']
	>('/api/v2/roles', ctx.key, {
		query: {
			'page[size]': input.pageSize,
			'page[number]': input.pageNumber,
			filter: input.filter,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.roles.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const apiKeysList: DatadogEndpoints['apiKeysList'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['apiKeysList']
	>('/api/v2/api_keys', ctx.key, {
		query: {
			'page[size]': input.pageSize,
			'page[number]': input.pageNumber,
			filter: input.filter,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.apiKeys.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const incidentsList: DatadogEndpoints['incidentsList'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['incidentsList']
	>('/api/v2/incidents', ctx.key, {
		query: {
			'page[size]': input.pageSize,
			'page[offset]': input.pageOffset,
		},
	});

	if (ctx.db?.incidents) {
		for (const incident of response.data ?? []) {
			if (!incident.id) continue;
			try {
				const attributes = incident.attributes ?? {};
				await ctx.db.incidents.upsertByEntityId(incident.id, {
					id: incident.id,
					title:
						typeof attributes.title === 'string' ? attributes.title : undefined,
					state:
						typeof attributes.state === 'string' ? attributes.state : undefined,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('[datadog] Failed to save incident:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'datadog.incidents.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const awsList: DatadogEndpoints['awsList'] = async (ctx, _input) => {
	const response = await makeDatadogRequest<DatadogEndpointOutputs['awsList']>(
		'/api/v1/integration/aws',
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'datadog.aws.list',
		{ count: response.accounts?.length ?? 0 },
		'completed',
	);
	return response;
};

export const usageGetSummary: DatadogEndpoints['usageGetSummary'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['usageGetSummary']
	>('/api/v1/usage/summary', ctx.key, {
		query: {
			start_month: input.startMonth,
			end_month: input.endMonth,
			include_org_details: input.includeOrgDetails,
		},
	});

	await logEventFromContext(
		ctx,
		'datadog.usage.getSummary',
		{ startMonth: input.startMonth },
		'completed',
	);
	return response;
};
