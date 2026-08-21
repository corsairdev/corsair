import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import { cacheRecord, cacheRecords, evictEntity } from './persist';
import type { ClientaryEstimate } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryEstimateSchema,
	ClientarySendResponseSchema,
} from './types';

/**
 * List all estimates.
 *
 * API: GET /api/v2/estimates
 * Docs: https://www.clientary.com/api/estimates
 */
export const list: ClientaryEndpoints['estimatesList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.estimatesList>
	>('estimates', apiKey, domain, {
		query: { page: input.page },
	});

	const parsed = ClientaryEndpointOutputSchemas.estimatesList.parse(response);

	await cacheRecords(ctx.db.estimates, parsed.estimates, 'estimate');

	await logEventFromContext(
		ctx,
		'clientary.estimates.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List estimates belonging to a single client.
 *
 * API: GET /api/v2/clients/:client_id/estimates
 * Docs: https://www.clientary.com/api/estimates
 */
export const listForClient: ClientaryEndpoints['estimatesListForClient'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<typeof ClientaryEndpointOutputSchemas.estimatesListForClient>
		>(`clients/${input.client_id}/estimates`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.estimatesListForClient.parse(response);

		await cacheRecords(ctx.db.estimates, parsed.estimates, 'estimate');

		await logEventFromContext(
			ctx,
			'clientary.estimates.listForClient',
			{ client_id: input.client_id },
			'completed',
		);
		return parsed;
	};

/**
 * List estimates belonging to a single project.
 *
 * API: GET /api/v2/projects/:project_id/estimates
 * Docs: https://www.clientary.com/api/estimates
 */
export const listForProject: ClientaryEndpoints['estimatesListForProject'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<typeof ClientaryEndpointOutputSchemas.estimatesListForProject>
		>(`projects/${input.project_id}/estimates`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.estimatesListForProject.parse(response);

		await cacheRecords(ctx.db.estimates, parsed.estimates, 'estimate');

		await logEventFromContext(
			ctx,
			'clientary.estimates.listForProject',
			{ project_id: input.project_id },
			'completed',
		);
		return parsed;
	};

/**
 * Get a single estimate by ID.
 *
 * API: GET /api/v2/estimates/:id
 * Docs: https://www.clientary.com/api/estimates
 */
export const get: ClientaryEndpoints['estimatesGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryEstimate>(
		`estimates/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryEstimateSchema.parse(response);

	await cacheRecord(ctx.db.estimates, parsed, 'estimate');

	await logEventFromContext(
		ctx,
		'clientary.estimates.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new estimate.
 *
 * API: POST /api/v2/estimates
 * Docs: https://www.clientary.com/api/estimates
 */
export const create: ClientaryEndpoints['estimatesCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryEstimate>(
		'estimates',
		apiKey,
		domain,
		{ method: 'POST', body: { estimate: { ...input } } },
	);

	const parsed = ClientaryEstimateSchema.parse(response);

	await cacheRecord(ctx.db.estimates, parsed, 'estimate');

	await logEventFromContext(
		ctx,
		'clientary.estimates.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing estimate. `id` is required; provide a partial list of
 * fields.
 *
 * API: PUT /api/v2/estimates/:id
 * Docs: https://www.clientary.com/api/estimates
 */
export const update: ClientaryEndpoints['estimatesUpdate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryEstimate>(
		`estimates/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { estimate: { ...fields } } },
	);

	const parsed = ClientaryEstimateSchema.parse(response);

	await cacheRecord(ctx.db.estimates, parsed, 'estimate');

	await logEventFromContext(
		ctx,
		'clientary.estimates.update',
		{ id },
		'completed',
	);
	return parsed;
};

/**
 * Delete an estimate.
 *
 * API: DELETE /api/v2/estimates/:id
 * Docs: https://www.clientary.com/api/estimates
 */
export const remove: ClientaryEndpoints['estimatesDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	await makeClientaryRequest<unknown>(`estimates/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.estimates, input.id, 'estimate');

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.estimates.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};

/**
 * Send an estimate via email to one or more recipients.
 *
 * API: POST /api/v2/estimates/:id/messages
 * Docs: https://www.clientary.com/api/estimates
 */
export const send: ClientaryEndpoints['estimatesSend'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...message } = input;

	await makeClientaryRequest<unknown>(
		`estimates/${id}/messages`,
		apiKey,
		domain,
		{
			method: 'POST',
			body: { ...message },
		},
	);

	const result = ClientarySendResponseSchema.parse({
		sent: true,
		id,
	});

	await logEventFromContext(
		ctx,
		'clientary.estimates.send',
		{ id },
		'completed',
	);
	return result;
};
