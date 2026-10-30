import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryStaff } from './types';
import { ClientaryEndpointOutputSchemas, ClientaryStaffSchema } from './types';

/**
 * List all staff members.
 *
 * API: GET /api/v2/staff
 * Docs: https://www.clientary.com/api/staff
 */
export const list: ClientaryEndpoints['staffList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.staffList>
	>('staff', apiKey, domain);

	const parsed = ClientaryEndpointOutputSchemas.staffList.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.staff.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Get a single staff member by ID.
 *
 * API: GET /api/v2/staff/:id
 * Docs: https://www.clientary.com/api/staff
 */
export const get: ClientaryEndpoints['staffGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryStaff>(
		`staff/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryStaffSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.staff.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};
