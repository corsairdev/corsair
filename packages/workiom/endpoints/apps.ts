import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import type { AppsGetAllResponse } from './types';

/**
 * List all apps in the account.
 * API: GET /api/services/app/Apps/GetAll
 */
export const getAll: WorkiomEndpoints['appsGetAll'] = async (ctx) => {
	const response = await makeWorkiomRequest<AppsGetAllResponse>(
		'api/services/app/Apps/GetAll',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'workiom.apps.getAll', {}, 'completed');
	return response;
};
