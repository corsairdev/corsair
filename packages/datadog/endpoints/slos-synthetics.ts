import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs, Slo } from './types';

async function upsertSlo(
	ctx: Parameters<DatadogEndpoints['slosList']>[0],
	slo: Slo,
): Promise<void> {
	if (!ctx.db?.slos || !slo.id) {
		return;
	}
	try {
		await ctx.db.slos.upsertByEntityId(slo.id, {
			id: slo.id,
			name: slo.name,
			type: slo.type,
			description: slo.description ?? undefined,
			tags: slo.tags,
			createdAt: new Date(),
		});
	} catch (error) {
		console.warn('[datadog] Failed to save SLO:', error);
	}
}

export const slosList: DatadogEndpoints['slosList'] = async (ctx, input) => {
	const response = await makeDatadogRequest<DatadogEndpointOutputs['slosList']>(
		'/api/v1/slo',
		ctx.key,
		{
			query: {
				ids: input.ids,
				query: input.query,
				tags_query: input.tagsQuery,
				limit: input.limit,
				offset: input.offset,
			},
		},
	);

	for (const slo of response.data ?? []) {
		await upsertSlo(ctx, slo);
	}

	await logEventFromContext(
		ctx,
		'datadog.slos.list',
		{ count: response.data?.length ?? 0 },
		'completed',
	);
	return response;
};

export const slosCreate: DatadogEndpoints['slosCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['slosCreate']
	>('/api/v1/slo', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			type: input.type,
			thresholds: input.thresholds,
			description: input.description,
			tags: input.tags,
			monitor_ids: input.monitorIds,
			query: input.query,
		},
	});

	for (const slo of response.data ?? []) {
		await upsertSlo(ctx, slo);
	}

	await logEventFromContext(
		ctx,
		'datadog.slos.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const syntheticsListTests: DatadogEndpoints['syntheticsListTests'] =
	async (ctx, input) => {
		const response = await makeDatadogRequest<
			DatadogEndpointOutputs['syntheticsListTests']
		>('/api/v1/synthetics/tests', ctx.key, {
			query: {
				page_size: input.pageSize,
				page_number: input.pageNumber,
			},
		});

		await logEventFromContext(
			ctx,
			'datadog.synthetics.listTests',
			{ count: response.tests?.length ?? 0 },
			'completed',
		);
		return response;
	};

export const syntheticsGetApiTest: DatadogEndpoints['syntheticsGetApiTest'] =
	async (ctx, input) => {
		const response = await makeDatadogRequest<
			DatadogEndpointOutputs['syntheticsGetApiTest']
		>('/api/v1/synthetics/tests/api/{publicId}', ctx.key, {
			path: { publicId: input.publicId },
		});

		await logEventFromContext(
			ctx,
			'datadog.synthetics.getApiTest',
			{ publicId: input.publicId },
			'completed',
		);
		return response;
	};

export const syntheticsCreateApiTest: DatadogEndpoints['syntheticsCreateApiTest'] =
	async (ctx, input) => {
		const response = await makeDatadogRequest<
			DatadogEndpointOutputs['syntheticsCreateApiTest']
		>('/api/v1/synthetics/tests/api', ctx.key, {
			method: 'POST',
			body: {
				name: input.name,
				type: 'api',
				subtype: input.subtype,
				config: input.config,
				locations: input.locations,
				options: input.options,
				message: input.message,
				tags: input.tags,
			},
		});

		await logEventFromContext(
			ctx,
			'datadog.synthetics.createApiTest',
			{ name: input.name, publicId: response.public_id },
			'completed',
		);
		return response;
	};

export const syntheticsListLocations: DatadogEndpoints['syntheticsListLocations'] =
	async (ctx, _input) => {
		const response = await makeDatadogRequest<
			DatadogEndpointOutputs['syntheticsListLocations']
		>('/api/v1/synthetics/locations', ctx.key);

		await logEventFromContext(
			ctx,
			'datadog.synthetics.listLocations',
			{ count: response.locations?.length ?? 0 },
			'completed',
		);
		return response;
	};
