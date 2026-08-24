import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryRecurringSchedule } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryRecurringScheduleSchema,
} from './types';

/**
 * List all recurring schedules.
 *
 * API: GET /api/v2/recurring
 * Docs: https://www.clientary.com/api/recurring_schedules
 */
export const list: ClientaryEndpoints['recurringList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.recurringList>
	>('recurring', apiKey, domain, {
		query: { page: input.page },
	});

	const parsed = ClientaryEndpointOutputSchemas.recurringList.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.recurring.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Get a single recurring schedule by ID.
 *
 * API: GET /api/v2/recurring/:id
 * Docs: https://www.clientary.com/api/recurring_schedules
 */
export const get: ClientaryEndpoints['recurringGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryRecurringSchedule>(
		`recurring/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryRecurringScheduleSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.recurring.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new recurring schedule.
 *
 * API: POST /api/v2/recurring
 * Docs: https://www.clientary.com/api/recurring_schedules
 */
export const create: ClientaryEndpoints['recurringCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryRecurringSchedule>(
		'recurring',
		apiKey,
		domain,
		{ method: 'POST', body: { recurring_schedule: { ...input } } },
	);

	const parsed = ClientaryRecurringScheduleSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.recurring.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing recurring schedule.
 *
 * API: PUT /api/v2/recurring/:id
 * Docs: https://www.clientary.com/api/recurring_schedules
 */
export const update: ClientaryEndpoints['recurringUpdate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryRecurringSchedule>(
		`recurring/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { recurring_schedule: { ...fields } } },
	);

	const parsed = ClientaryRecurringScheduleSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.recurring.update',
		{ id },
		'completed',
	);
	return parsed;
};

/**
 * Delete a recurring schedule.
 *
 * API: DELETE /api/v2/recurring/:id
 * Docs: https://www.clientary.com/api/recurring_schedules
 */
export const remove: ClientaryEndpoints['recurringDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	await makeClientaryRequest<unknown>(`recurring/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.recurring.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
