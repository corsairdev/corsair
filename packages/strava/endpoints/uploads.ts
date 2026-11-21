import { logEventFromContext } from 'corsair/core';
import { resolveFileInput } from 'corsair/http';
import { makeStravaRequest } from '../client';
import type { StravaEndpoints } from '../index';
import type { StravaEndpointOutputs } from './types';
import { StravaEndpointInputSchemas } from './types';

/**
 * Strava's API docs give no upload limit; its site caps an activity file at
 * 25 MB, so a link is held to that.
 */
export const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

export const create: StravaEndpoints['uploadsCreate'] = async (ctx, input) => {
	// A Blob is sent as it was given; a link or base64 becomes the file here,
	// named for its data_type when neither the input nor its URL names it.
	const given = StravaEndpointInputSchemas.uploadsCreate.shape.file.parse(
		input.file,
	);
	const file =
		given instanceof Blob
			? given
			: (
					await resolveFileInput(given, {
						maxBytes: UPLOAD_MAX_BYTES,
						fallbackName: `activity.${input.data_type}`,
					})
				).file;

	// Strava POST /uploads requires multipart/form-data — use formData, not JSON body
	const result = await makeStravaRequest<
		StravaEndpointOutputs['uploadsCreate']
	>('uploads', ctx.key, {
		method: 'POST',
		formData: {
			file,
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

	// The file is the payload itself (base64 or bytes), so it is not logged.
	const { file: _file, ...logged } = input;
	await logEventFromContext(
		ctx,
		'strava.uploads.create',
		{ ...logged },
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
