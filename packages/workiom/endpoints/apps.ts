import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import { AppsGetAllOutputSchema } from './types';

export const getAll: WorkiomEndpoints['appsGetAll'] = async (ctx) => {
	const raw = await makeWorkiomRequest(
		'/api/services/app/Apps/GetAll',
		ctx.key,
	);
	const page =
		raw && typeof raw === 'object' && 'items' in raw
			? raw
			: { items: Array.isArray(raw) ? raw : [] };
	const response = AppsGetAllOutputSchema.parse(page);
	await logEventFromContext(ctx, 'workiom.apps.getAll', {}, 'completed');
	return response;
};
