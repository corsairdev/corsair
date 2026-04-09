import { logEventFromContext } from 'corsair/core';
import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const create: StravaEndpoints['uploadsCreate'] = async (ctx, input) => {
	// Strava POST /uploads requires multipart/form-data — use formData, not JSON body
	const result = await makeStravaRequest<
		StravaEndpointOutputs['uploadsCreate']
	>('uploads', ctx.key, {
		method: 'POST',
		formData: {
			file: input.file,
			data_type: input.data_type,
			...(input.name !== undefined && { name: input.name }),
			...(input.description !== undefined && {
				description: input.description,
			}),
			...(input.trainer !== undefined && { trainer: input.trainer }),
			...(input.commute !== undefined && { commute: input.commute }),
			...(input.external_id !== undefined && {
				external_id: input.external_id,
			}),
		},
	});

	if (result.id && ctx.db.uploads) {
		try {
			await ctx.db.uploads.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save upload to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'strava.uploads.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: StravaEndpoints['uploadsGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['uploadsGet']>(
		`uploads/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.uploads) {
		try {
			await ctx.db.uploads.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save upload to database:', error);
		}
	}

	return result;
};
