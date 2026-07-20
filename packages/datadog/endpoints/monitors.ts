import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs, Monitor } from './types';

async function upsertMonitor(
	ctx: Parameters<DatadogEndpoints['monitorsGet']>[0],
	monitor: Monitor,
): Promise<void> {
	if (!ctx.db?.monitors || monitor.id === undefined) {
		return;
	}
	try {
		await ctx.db.monitors.upsertByEntityId(String(monitor.id), {
			id: String(monitor.id),
			name: monitor.name,
			type: monitor.type,
			query: monitor.query,
			message: monitor.message,
			overallState: monitor.overall_state,
			tags: monitor.tags,
			priority: monitor.priority ?? undefined,
			createdAt: new Date(),
		});
	} catch (error) {
		console.warn('[datadog] Failed to save monitor:', error);
	}
}

export const list: DatadogEndpoints['monitorsList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsList']
	>('/api/v1/monitor', ctx.key, {
		query: {
			name: input.name,
			tags: input.tags,
			monitor_tags: input.monitorTags,
			group_states: input.groupStates,
			page: input.page,
			page_size: input.pageSize,
		},
	});

	for (const monitor of response) {
		await upsertMonitor(ctx, monitor);
	}

	await logEventFromContext(
		ctx,
		'datadog.monitors.list',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const search: DatadogEndpoints['monitorsSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsSearch']
	>('/api/v1/monitor/search', ctx.key, {
		query: {
			query: input.query,
			page: input.page,
			per_page: input.perPage,
			sort: input.sort,
		},
	});

	for (const monitor of response.monitors ?? []) {
		await upsertMonitor(ctx, monitor);
	}

	await logEventFromContext(
		ctx,
		'datadog.monitors.search',
		{ query: input.query, count: response.monitors?.length ?? 0 },
		'completed',
	);
	return response;
};

export const get: DatadogEndpoints['monitorsGet'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsGet']
	>('/api/v1/monitor/{monitorId}', ctx.key, {
		path: { monitorId: input.monitorId },
		query: { group_states: input.groupStates },
	});

	await upsertMonitor(ctx, response);

	await logEventFromContext(
		ctx,
		'datadog.monitors.get',
		{ monitorId: input.monitorId },
		'completed',
	);
	return response;
};

export const create: DatadogEndpoints['monitorsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsCreate']
	>('/api/v1/monitor', ctx.key, {
		method: 'POST',
		body: {
			type: input.type,
			query: input.query,
			name: input.name,
			message: input.message,
			tags: input.tags,
			priority: input.priority,
			options: input.options,
		},
	});

	await upsertMonitor(ctx, response);

	await logEventFromContext(
		ctx,
		'datadog.monitors.create',
		{ name: input.name, monitorId: response.id },
		'completed',
	);
	return response;
};

export const update: DatadogEndpoints['monitorsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsUpdate']
	>('/api/v1/monitor/{monitorId}', ctx.key, {
		method: 'PUT',
		path: { monitorId: input.monitorId },
		body: {
			name: input.name,
			query: input.query,
			message: input.message,
			tags: input.tags,
			priority: input.priority,
			options: input.options,
		},
	});

	await upsertMonitor(ctx, response);

	await logEventFromContext(
		ctx,
		'datadog.monitors.update',
		{ monitorId: input.monitorId },
		'completed',
	);
	return response;
};

export const remove: DatadogEndpoints['monitorsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsDelete']
	>('/api/v1/monitor/{monitorId}', ctx.key, {
		method: 'DELETE',
		path: { monitorId: input.monitorId },
	});

	if (ctx.db?.monitors) {
		try {
			await ctx.db.monitors.deleteByEntityId(String(input.monitorId));
		} catch (error) {
			console.warn('[datadog] Failed to delete stored monitor:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'datadog.monitors.delete',
		{ monitorId: input.monitorId },
		'completed',
	);
	return response;
};

export const mute: DatadogEndpoints['monitorsMute'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsMute']
	>('/api/v1/monitor/{monitorId}/mute', ctx.key, {
		method: 'POST',
		path: { monitorId: input.monitorId },
		body: { scope: input.scope, end: input.end },
	});

	await logEventFromContext(
		ctx,
		'datadog.monitors.mute',
		{ monitorId: input.monitorId, scope: input.scope },
		'completed',
	);
	return response;
};

export const unmute: DatadogEndpoints['monitorsUnmute'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['monitorsUnmute']
	>('/api/v1/monitor/{monitorId}/unmute', ctx.key, {
		method: 'POST',
		path: { monitorId: input.monitorId },
		body: { scope: input.scope, all_scopes: input.allScopes },
	});

	await logEventFromContext(
		ctx,
		'datadog.monitors.unmute',
		{ monitorId: input.monitorId },
		'completed',
	);
	return response;
};
