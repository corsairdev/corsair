import { logEventFromContext } from 'corsair/core';
import type { FomoEndpoints } from '..';
import { makeFomoRequest } from '../client';
import type {
	ApplicationGetOutput,
	ApplicationGetStatsOutput,
	ApplicationUpdateOutput,
} from './types';
import {
	ApplicationGetInputSchema,
	ApplicationGetOutputSchema,
	ApplicationGetStatsInputSchema,
	ApplicationGetStatsOutputSchema,
	ApplicationUpdateInputSchema,
	ApplicationUpdateOutputSchema,
} from './types';

// The token's own application is `/applications/me`; another application of the same
// user is `/users/me/applications/:id` (Fomo's curl sample). `/applications/me/:id` is a 404.
function applicationPath(id: number | string | undefined): string {
	return id !== undefined
		? `/users/me/applications/${encodeURIComponent(String(id))}`
		: '/applications/me';
}

export const getApplication: FomoEndpoints['application.get'] = async (
	ctx,
	input,
) => {
	const parsedInput = ApplicationGetInputSchema.parse(input);
	const path = applicationPath(parsedInput.id);

	const response = await makeFomoRequest<ApplicationGetOutput>(path, ctx.key, {
		method: 'GET',
	});

	const parsed = ApplicationGetOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.application.get',
		{ applicationId: parsed.id ?? parsedInput.id },
		'completed',
	);

	return parsed;
};

export const updateApplication: FomoEndpoints['application.update'] = async (
	ctx,
	input,
) => {
	const parsedInput = ApplicationUpdateInputSchema.parse(input);
	const { id, ...appData } = parsedInput;
	const path = applicationPath(id);

	const response = await makeFomoRequest<ApplicationUpdateOutput>(
		path,
		ctx.key,
		{
			method: 'PATCH',
			body: { application: appData },
		},
	);

	const parsed = ApplicationUpdateOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'fomo.application.update',
		{ applicationId: parsed.id ?? id },
		'completed',
	);

	return parsed;
};

export const getApplicationStats: FomoEndpoints['application.getStats'] =
	async (ctx, input) => {
		const parsedInput = ApplicationGetStatsInputSchema.parse(input);
		const response = await makeFomoRequest<ApplicationGetStatsOutput>(
			'/applications/me/dashboard',
			ctx.key,
			{
				method: 'GET',
				query: {
					'date_range[from]': parsedInput.date_range.from,
					'date_range[to]': parsedInput.date_range.to,
				},
			},
		);

		const parsed = ApplicationGetStatsOutputSchema.parse(response);

		await logEventFromContext(
			ctx,
			'fomo.application.getStats',
			{
				from: parsedInput.date_range.from,
				to: parsedInput.date_range.to,
			},
			'completed',
		);

		return parsed;
	};
