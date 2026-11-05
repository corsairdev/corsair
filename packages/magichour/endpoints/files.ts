import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

export const generateUploadUrls: MagicHourEndpoints['filesGenerateUploadUrls'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.filesGenerateUploadUrls.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['filesGenerateUploadUrls']
		>('/v1/files/upload-urls', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			MagicHourEndpointOutputSchemas.filesGenerateUploadUrls.parse(response);

		// Log only how many upload URLs were issued; the URLs themselves are
		// short-lived secrets.
		await logEventFromContext(
			ctx,
			'magichour.files.generateUploadUrls',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};

export const savedItemsList: MagicHourEndpoints['filesSavedItemsList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.filesSavedItemsList.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['filesSavedItemsList']
	>('/v1/saved-items', ctx.key, {
		method: 'GET',
		query: {
			type: parsedInput.type,
			limit: parsedInput.limit,
			cursor: parsedInput.cursor,
		},
	});

	const parsed =
		MagicHourEndpointOutputSchemas.filesSavedItemsList.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.files.savedItemsList',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};
