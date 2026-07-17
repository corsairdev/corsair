import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { Dashboard, DatadogEndpointOutputs } from './types';

async function upsertDashboard(
	ctx: Parameters<DatadogEndpoints['dashboardsGet']>[0],
	dashboard: Dashboard,
): Promise<void> {
	if (!ctx.db?.dashboards || !dashboard.id) {
		return;
	}
	try {
		await ctx.db.dashboards.upsertByEntityId(dashboard.id, {
			id: dashboard.id,
			title: dashboard.title,
			description: dashboard.description ?? undefined,
			layoutType: dashboard.layout_type,
			url: dashboard.url,
			authorHandle: dashboard.author_handle,
			createdAt: new Date(),
		});
	} catch (error) {
		console.warn('[datadog] Failed to save dashboard:', error);
	}
}

export const list: DatadogEndpoints['dashboardsList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['dashboardsList']
	>('/api/v1/dashboard', ctx.key, {
		query: {
			'filter[shared]': input.filterShared,
			'filter[deleted]': input.filterDeleted,
			count: input.count,
			start: input.start,
		},
	});

	for (const dashboard of response.dashboards ?? []) {
		await upsertDashboard(ctx, dashboard);
	}

	await logEventFromContext(
		ctx,
		'datadog.dashboards.list',
		{ count: response.dashboards?.length ?? 0 },
		'completed',
	);
	return response;
};

export const get: DatadogEndpoints['dashboardsGet'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['dashboardsGet']
	>('/api/v1/dashboard/{dashboardId}', ctx.key, {
		path: { dashboardId: input.dashboardId },
	});

	await upsertDashboard(ctx, response);

	await logEventFromContext(
		ctx,
		'datadog.dashboards.get',
		{ dashboardId: input.dashboardId },
		'completed',
	);
	return response;
};

export const create: DatadogEndpoints['dashboardsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['dashboardsCreate']
	>('/api/v1/dashboard', ctx.key, {
		method: 'POST',
		body: {
			title: input.title,
			widgets: input.widgets,
			layout_type: input.layoutType,
			description: input.description,
			notify_list: input.notifyList,
			tags: input.tags,
		},
	});

	await upsertDashboard(ctx, response);

	await logEventFromContext(
		ctx,
		'datadog.dashboards.create',
		{ title: input.title, dashboardId: response.id },
		'completed',
	);
	return response;
};

export const update: DatadogEndpoints['dashboardsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['dashboardsUpdate']
	>('/api/v1/dashboard/{dashboardId}', ctx.key, {
		method: 'PUT',
		path: { dashboardId: input.dashboardId },
		body: {
			title: input.title,
			widgets: input.widgets,
			layout_type: input.layoutType,
			description: input.description,
			notify_list: input.notifyList,
			tags: input.tags,
		},
	});

	await upsertDashboard(ctx, response);

	await logEventFromContext(
		ctx,
		'datadog.dashboards.update',
		{ dashboardId: input.dashboardId },
		'completed',
	);
	return response;
};

export const remove: DatadogEndpoints['dashboardsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['dashboardsDelete']
	>('/api/v1/dashboard/{dashboardId}', ctx.key, {
		method: 'DELETE',
		path: { dashboardId: input.dashboardId },
	});

	if (ctx.db?.dashboards) {
		try {
			await ctx.db.dashboards.deleteByEntityId(input.dashboardId);
		} catch (error) {
			console.warn('[datadog] Failed to delete stored dashboard:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'datadog.dashboards.delete',
		{ dashboardId: input.dashboardId },
		'completed',
	);
	return response;
};
