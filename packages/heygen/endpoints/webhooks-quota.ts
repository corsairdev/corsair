import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// HeyGen's v3 docs mention a `/v3/webhooks/endpoints/*` surface with full CRUD, secret
// rotation, and an event log, but its request/response shapes aren't documented yet, so the
// webhook endpoint CRUD and remaining-quota operations below stay on their confirmed v1/v2
// paths per developers.heygen.com/endpoint-version-comparison.

export const addEndpoint: HeygenEndpoints['webhooksQuotaAddEndpoint'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['webhooksQuotaAddEndpoint']
	>('/v1/webhook/endpoint.add', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.webhooksQuota.addEndpoint',
		{ itemCount: input.events.length },
		'completed',
	);
	return result;
};

export const listEndpoints: HeygenEndpoints['webhooksQuotaListEndpoints'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaListEndpoints']
		>('/v1/webhook/endpoint.list', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.listEndpoints',
			{},
			'completed',
		);
		return result;
	};

export const listEventTypes: HeygenEndpoints['webhooksQuotaListEventTypes'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaListEventTypes']
		>('/v1/webhook/webhook.list', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.listEventTypes',
			{},
			'completed',
		);
		return result;
	};

// [B] Path inferred as `PATCH /v1/webhook/endpoint.update`; see endpoints/types.ts.
export const updateEndpoint: HeygenEndpoints['webhooksQuotaUpdateEndpoint'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaUpdateEndpoint']
		>('/v1/webhook/endpoint.update', ctx.key, { method: 'PATCH', body: input });

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.updateEndpoint',
			{ endpointId: input.endpoint_id },
			'completed',
		);
		return result;
	};

export const deleteEndpoint: HeygenEndpoints['webhooksQuotaDeleteEndpoint'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaDeleteEndpoint']
		>('/v1/webhook/endpoint.delete', ctx.key, {
			method: 'DELETE',
			query: { endpoint_id: input.endpoint_id },
		});

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.deleteEndpoint',
			{ endpointId: input.endpoint_id },
			'completed',
		);
		return result;
	};

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const getCurrentUser: HeygenEndpoints['webhooksQuotaGetCurrentUser'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaGetCurrentUser']
		>('/v3/users/me', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.getCurrentUser',
			{},
			'completed',
		);
		return result;
	};

export const remainingQuota: HeygenEndpoints['webhooksQuotaRemainingQuota'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaRemainingQuota']
		>('/v2/user/remaining_quota', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.remainingQuota',
			{},
			'completed',
		);
		return result;
	};

// --- v3 additions, per developers.heygen.com. Named with a `V3` suffix since they'd
// otherwise collide with the legacy v1 webhook operations above. ---

// Migrated to HeyGen v3 API per developers.heygen.com
export const listEventTypesV3: HeygenEndpoints['webhooksListEventTypesV3'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksListEventTypesV3']
		>('/v3/webhooks/event-types', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.listEventTypesV3',
			{},
			'completed',
		);
		return result;
	};

// Migrated to HeyGen v3 API per developers.heygen.com
export const listEndpointsV3: HeygenEndpoints['webhooksListEndpointsV3'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksListEndpointsV3']
		>('/v3/webhooks/endpoints', ctx.key, {
			method: 'GET',
			query: { limit: input.limit, token: input.token },
		});

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.listEndpointsV3',
			{},
			'completed',
		);
		return result;
	};

// Migrated to HeyGen v3 API per developers.heygen.com
export const addEndpointV3: HeygenEndpoints['webhooksAddEndpointV3'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['webhooksAddEndpointV3']
	>('/v3/webhooks/endpoints', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.webhooksQuota.addEndpointV3',
		{},
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const deleteEndpointV3: HeygenEndpoints['webhooksDeleteEndpointV3'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksDeleteEndpointV3']
		>(`/v3/webhooks/endpoints/${input.endpoint_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.deleteEndpointV3',
			{ endpointId: input.endpoint_id },
			'completed',
		);
		return result;
	};

// Migrated to HeyGen v3 API per developers.heygen.com
export const updateEndpointV3: HeygenEndpoints['webhooksUpdateEndpointV3'] =
	async (ctx, input) => {
		const { endpoint_id, ...body } = input;
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksUpdateEndpointV3']
		>(`/v3/webhooks/endpoints/${endpoint_id}`, ctx.key, {
			method: 'PATCH',
			body,
		});

		await logEventFromContext(
			ctx,
			'heygen.webhooksQuota.updateEndpointV3',
			{ endpointId: endpoint_id },
			'completed',
		);
		return result;
	};

// Migrated to HeyGen v3 API per developers.heygen.com
export const rotateSecret: HeygenEndpoints['webhooksRotateSecret'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['webhooksRotateSecret']
	>(`/v3/webhooks/endpoints/${input.endpoint_id}/rotate-secret`, ctx.key, {
		method: 'POST',
		body: {},
	});

	await logEventFromContext(
		ctx,
		'heygen.webhooksQuota.rotateSecret',
		{ endpointId: input.endpoint_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const listEvents: HeygenEndpoints['webhooksListEvents'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['webhooksListEvents']
	>('/v3/webhooks/events', ctx.key, {
		method: 'GET',
		query: {
			event_type: input.event_type,
			entity_id: input.entity_id,
			limit: input.limit,
			token: input.token,
		},
	});

	await logEventFromContext(
		ctx,
		'heygen.webhooksQuota.listEvents',
		{},
		'completed',
	);
	return result;
};
